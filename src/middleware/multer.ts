import multer from "multer";

export const singleUpload = multer().single("photo");
