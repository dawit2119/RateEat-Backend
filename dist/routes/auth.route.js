"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_1 = __importDefault(require("../middlewares/auth"));
const multer_1 = require("../middlewares/multer");
const upload_image_1 = require("../middlewares/upload-image");
const router = (0, express_1.Router)();
router.post("/send-otp", auth_controller_1.sendOtp);
router.post("/verify-phone-otp", auth_controller_1.verifyPhoneOTP);
router.get("/otp-users", auth_controller_1.getOtpUsers);
router.post("/register", multer_1.filterImage.single("file"), upload_image_1.uploadProfileImages, auth_controller_1.registerUser);
router.post("/login-google", auth_controller_1.loginGoogle);
router.post("/login-facebook", auth_controller_1.loginFacebook);
router.get("/me", auth_1.default, auth_controller_1.getCurrentUser);
exports.default = router;
