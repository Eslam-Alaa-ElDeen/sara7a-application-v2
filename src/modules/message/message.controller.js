import {Router} from "express"
import { createMessage } from "./messge.service.js";
import { authentication } from "../../middleware/authentication.middleware.js";
import { multerLocal } from "../../middleware/multer.middleware.js";
import { Multer_Enum } from "../../common/enum/index.js";
import { Validation } from "../../middleware/validation.middleware.js";
import { createMessageSchema } from "./message.validation.js";

const router=Router();

router.post("/",multerLocal({customPath:"admin/3mk_eslam",customTypes:Multer_Enum.images}).fields([
    {name:"attachments"}
]),authentication,Validation(createMessageSchema),createMessage)


export default router