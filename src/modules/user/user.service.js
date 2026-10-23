import {
  KEY_ACCESS,
  KEY_REFRESH,
  SALT,
} from "../../../config/config.service.js";
import { Decrypt, Encrypt } from "../../common/security/encryption.security.js";
import { Compare, Hash } from "../../common/security/hash.security.js";
import {
  create,
  findById,
  findOne,
  findOnedAndUpdate,
} from "../../DB/service/base.repository.js";
import { userModel } from "../../DB/model/user.model.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client();
import { randomUUID } from "node:crypto";
import { deleteKey, getValue, keys, setValue } from "../../DB/service/redis.service.js";
import { createOTP, sendEmail } from "../../common/services/sendEmail.js";
import { emailTemplate } from "../../common/services/html.template.js";
import { eventEmitter } from "../../common/utils/events/eventEmitter.js";
import { resolve } from "node:path";

export const signup = async (req, res, next) => {
  try {
    const { fName, lName, email, password, phone, gender, DOB, age } = req.body;

    const ExistUser = await findOne({
      model: userModel,
      filter: { email: email },
    });

    if (ExistUser) {
      throw new Error("email already exist", { cause: { status: 407 } });
    }

    const otp=await createOTP();
    await setValue({
      key:`otp::${email}`,
      value:await Hash(otp,SALT),
      ttl:120
    })

    eventEmitter.emit("confirm_email",async()=>{
      await sendEmail({
          to: email,
          subject: "Welcome to 3mk eslam!",
          html: emailTemplate({
              title: "Verify your email",
              subtitle: "Use the code below to finish signing in.",
              otp,
              otpExpiry: "This code expires in 2 minutes.",
          }),
          attachments:[{
            filename: "test.png",
            path: resolve( "uploads/test.png")
          }]
      });
    })



    const path_cover = [];
    for (const file of req.files.attachments) {
      path_cover.push(file.path);
    }

    const data = await create({
      model: userModel,
      data: {
        fName,
        lName,
        email,
        password: await Hash(password, SALT),
        phone: await Encrypt(phone),
        gender,
        DOB,
        age,
        profileImage: req.files.attachment[0].path,
        coverImage: path_cover,
      },
    });
    res.status(200).json({ data });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const confirmEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const otpValue=await getValue(`otp::${email}`)
    if(!otpValue)
      throw new Error("otp is expire",{cause:{status:400}})

    if(!await Compare(otp,otpValue))
      throw new Error("invalid otp",{cause:{status:400}})

    const user=await findOnedAndUpdate({
      model:userModel,
      filter:{
        email,
        isConfirmed:false
      },
      update:{
        isConfirmed:true
      }
    })

    if(!user)
      throw new Error("user not exist or already confirmed the email",{cause:{status:400}})

    await deleteKey(`otp::${email}`)
    res.status(200).json({msg:"done",user});
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const signupWithGmail = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    const ticket = await client.verifyIdToken({
      idToken,
      audience:
        "867768865965-l6sk69spvkgncdj1ni3oc3tphi8nk00b.apps.googleusercontent.com",
    });
    const { family_name, given_name, email, email_verified, picture } =
      ticket.getPayload();

    let user = await findOne({
      model: userModel,
      filter: { email: email.toLowerCase() },
    });

    if (!user) {
      user = await create({
        model: userModel,
        data: {
          fName: given_name,
          lName: family_name,
          email,
          profileImage: picture,
          isConfirmed: email_verified,
          provider: "google",
        },
      });
    }
    if (user.provider == "system")
      throw new Error("pls login with system", { cause: { status: 400 } });

    const access_token = jwt.sign(
      {
        id: user._id,
      },
      KEY_ACCESS,
      {
        expiresIn: 300,
        issuer: "https://localhost:3000",
      },
    );

    const refresh_token = jwt.sign(
      {
        id: user._id,
      },
      KEY_REFRESH,
      {
        expiresIn: 300,
        issuer: "https://localhost:3000",
      },
    );

    res.status(200).json({ message: "done", access_token, refresh_token });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};


export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const ExistUser = await findOne({
      model: userModel,
      filter: { email: email },
    });

    if (!ExistUser) {
      throw new Error("email not exist", { cause: { status: 404 } });
    }
    let passwordCheck = await Compare(password, ExistUser.password);
    if (!passwordCheck)
      throw new Error("password not matched", { cause: { status: 404 } });

    ExistUser.phone = await Decrypt(ExistUser.phone);

    const tokenId = randomUUID();

    const access_token = jwt.sign(
      {
        id: ExistUser._id,
      },
      KEY_ACCESS,
      {
        expiresIn: 300,
        issuer: "https://localhost:3000",
        jwtid: tokenId,
      },
    );

    const refresh_token = jwt.sign(
      {
        id: ExistUser._id,
      },
      KEY_REFRESH,
      {
        expiresIn: 36000,
        issuer: "https://localhost:3000",
        jwtid: tokenId,
      },
    );
    res.status(200).json({ tokens: { access_token, refresh_token } });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const profile = async (req, res, next) => {
  res.status(200).json({ user: req.user });
};

export const refreshToken = async (req, res, next) => {
  const { authorization } = req.headers;
  console.log(req.headers);
  console.log(authorization);

  if (!authorization)
    throw new Error("token not exist", { cause: { status: 404 } });

  const decoded = jwt.verify(authorization, KEY_REFRESH);

  if (!decoded?.id)
    throw new Error("invalid token", { cause: { status: 400 } });

  const user = await findOne({
    model: userModel,
    filter: {
      _id: decoded.id,
    },
  });

  if (!user) throw new Error("user not exist", { cause: { status: 400 } });

  const access_token = jwt.sign({ id: user._id }, KEY_ACCESS, {
    expiresIn: 300,
  });

  res.status(200).json({ message: "done", access_token });
};

export const shareProfile = async (req, res, next) => {
  const { id } = req.params;

  let user = await findById({
    model: userModel,
    ID: id,
    options: {
      password: 0,
      isConfirmed: 0,
      _id: 0,
      provider: 0,
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
      id: 0,
    },
  });

  if (!user) throw new Error("user not exist", { cause: { status: 400 } });

  user.phone = await Decrypt(user.phone);

  res.status(200).json({ user });
};

export const updateProfile = async (req, res, next) => {
  const { fName, lName, age, phone } = req.body;
  let updateObj = {};

  if (fName !== undefined) updateObj.fName = fName;

  if (lName !== undefined) updateObj.lName = lName;

  if (age !== undefined) updateObj.age = age;

  if (phone !== undefined) updateObj.phone = await Encrypt(phone);

  let user = await findOnedAndUpdate({
    model: userModel,
    filter: {
      _id: req.user._id,
    },
    update: updateObj,
  });
  user.phone = await Decrypt(user.phone);

  res.status(200).json({ message: "done on update", user });
};

export const updatePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!(await Compare(oldPassword, req.user.password)))
    throw new Error("the old password is wrong", { cause: { status: 401 } });

  req.user.password = await Hash(newPassword, SALT);

  req.user.changeCredentialAt = new Date();
  await req.user.save();

  res.status(200).json({ message: "password updated", user: req.user });
};

export const logout = async (req, res, next) => {
  const { flag } = req.query;

  if (flag == "all") {
    req.user.changeCredentialAt = Date.now();
    await deleteKey (await keys(`revoke_token::${req.user._id}`))
    await req.user.save();
  } else {
    await setValue({
      key:`revoke_token::${req.user._id}::${req.decoded.jti}`,
      value:req.decoded.jti,
      ttl:req.decoded.exp-Math.floor(Date.now()/1000)
    })
  }

  res.status(200).json({ message: "done on logout" });
};
