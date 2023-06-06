import { Router } from "express";
import {
  sendOtp,
  verifyPhoneOTP,
  getOtpUsers,
  registerUser,
  loginGoogle,
  getCurrentUser,
  loginFacebook
} from "../controllers/auth.controller";
import protectRoute from "../middlewares/auth";
import { filterImage } from "../middlewares/multer";
import { uploadProfileImages } from "../middlewares/upload-image";

const router = Router();
router.post("/send-otp", sendOtp);
router.post("/verify-phone-otp", verifyPhoneOTP);
router.get("/otp-users", getOtpUsers);
router.post("/register", filterImage.single("file"), uploadProfileImages, registerUser);
router.post("/login-google", loginGoogle);
router.post("/login-facebook", loginFacebook)
router.get("/me", protectRoute, getCurrentUser);

export default router;
