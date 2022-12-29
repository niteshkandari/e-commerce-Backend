import path from "path";
import multer from "multer";

const Storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images/");
    },
    filename:(req, file, cb) => { 
        let ext = path.extname(file.originalname);
        cb(null, Date.now() + ext)
    }
});

const upload = multer({
    storage:Storage,
    fileFilter: (req, file, cb) => {
        if(file.mimetype === "image/png" || file.mimetype === "image/jpg") {
            cb(null, true);
        } else {
            // console.log("only jpg and png files are allowed");
            cb(null, false);
            // cb(new Error())
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 2,
    }
});

export default upload;

