import multer from "multer";
import path from "path";
import { Request } from "express";

export const filterImage = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req: Request, files: Express.Multer.File, cb) => {
    const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".JPG", ".JPEG", ".PNG", ".MP4", ".mp4", ".mkv", ".MKV", ".mov", ".MOV", ".flv", ".FLV", ".mpeg", ".MPEG"])
    const ext = path.extname(files.originalname);
    if (!allowedExtensions.has(ext)) {
      cb(null, false);
      return;
    }
    cb(null, true);
  },
});