import multer from "multer"
import fs from "node:fs"
import { randomUUID } from "node:crypto"



export const multerLocal=({customPath="general",customTypes=[]})=>{
    const pathFolder=`uploads/${customPath}`
    if (!fs.existsSync(pathFolder)) {
        fs.mkdirSync(pathFolder,{recursive:true})
    }

    const storage=multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,pathFolder)
        },
        filename:(req,file,cb)=>{

            cb(null,randomUUID()+"_"+file.originalname)
        }
    })

    function fileFilter(req,file,cb){
        if (!customTypes.includes(file.mimetype)) {
            cb(new Error("Invalid file!"))
        }else
            cb(null,true)
    }


    const upload=multer({storage,fileFilter})
    return upload;
}
