import {Router} from "express"
import { createMessage, deleteManyMessage, deleteOneMessage, getAllMessages, getOneMessage } from "./messge.service.js";
import { authentication } from "../../middleware/authentication.middleware.js";
import { multerLocal } from "../../middleware/multer.middleware.js";
import { Multer_Enum } from "../../common/enum/index.js";
import { Validation } from "../../middleware/validation.middleware.js";
import { createMessageSchema } from "./message.validation.js";

const router=Router({
    strict:true,
    caseSensitive:true,
    mergeParams:true
});

router.post("/",multerLocal({customPath:"admin/3mk_eslam",customTypes:Multer_Enum.images}).fields([
    {name:"attachments"}
]),authentication,Validation(createMessageSchema),createMessage)


router.get("/",authentication,getAllMessages)
router.get("/:id",authentication,getOneMessage)
router.delete("/",authentication,deleteManyMessage)
router.delete("/:id",authentication,deleteOneMessage)


export default router