import { SALT } from "../../../config/config.service.js";
import { Hash } from "../../common/security/hash.security.js";
import { emailTemplate } from "../../common/services/html.template.js";
import { createOTP, sendEmail } from "../../common/services/sendEmail.js";
import { eventEmitter } from "../../common/utils/events/eventEmitter.js";
import { findOne } from "../../DB/index.js";
import { userModel } from "../../DB/model/user.model.js";
import { getValue, incr, setValue, ttl } from "../../DB/service/redis.service.js";

export const sendOtp = async ({email,isConfirmed=false}) => {

    const user = await findOne({
            model: userModel,
            filter: {
            email,
            isConfirmed:{$exists:isConfirmed}
        },
    });

    if (!user)
        throw new Error("user not exist or already confirmed the email", {
        cause: { status: 400 },
    });

    const ttlOtp = await ttl(`otp::${email}`);
    if (ttlOtp > 0)
        throw new Error(`can't resend otp after ${ttlOtp}`, {
        cause: { status: 400 },
    });

    const blokeTtlOtp = await ttl(`otp::bloke::${email}`);
    if (blokeTtlOtp > 0)
        throw new Error(`you can resend otp after ${blokeTtlOtp}`, {
        cause: { status: 400 },
    });

    const maxOtpTtl = await getValue(`otp::max::${email}`);
    if (maxOtpTtl >= 4) {
        await setValue({
            key: `otp::bloke::${email}`,
            value: `${email}`,
            ttl: 60 * 7,
        });
        await setValue({
            key:`otp::max::${email}`,
            value:0,
            ttl:60*10
        })
        throw new Error(
            `you have exceeded the maximum number of tries and u have a block for 7 min`,
            { cause: { status: 400 } },
        );
    }
    const otp = await createOTP();
    await setValue({
        key: `otp::${email}`,
        value: await Hash(otp, SALT),
        ttl: 120,
    });

    eventEmitter.emit("confirm_email", async () => {
        await sendEmail({
            to: email,
            subject: "Welcome to sara7a app!",
            html: emailTemplate({
                name:"sara7a app",
                message:"confirm email",
                otp,
                otpExpiry:"otp expire after 2 min"
            })
        });
    });

    await incr(`otp::max::${email}`);
};
