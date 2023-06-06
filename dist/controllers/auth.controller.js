"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginFacebook = exports.getCurrentUser = exports.loginGoogle = exports.registerUser = exports.getOtpUsers = exports.verifyPhoneOTP = exports.sendOtp = void 0;
const models_1 = require("../models");
const otp_utils_1 = require("../utils/otp.utils");
const Otp_1 = __importDefault(require("../models/OTP/Otp"));
const async_handler_1 = __importDefault(require("../middlewares/async-handler"));
const error_response_utils_1 = __importDefault(require("../utils/error-response.utils"));
const auth_util_1 = require("../utils/auth.util");
// ========================Authentication with Phone==================================
// @desc send otp to user
// @route POST /api/v1/auth/send-otp
const sendOtp = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone } = req.body;
    if (!phone) {
        return next(new error_response_utils_1.default("Phone number is required", 400));
    }
    const otp = (0, otp_utils_1.generateOTP)(4);
    // send otp to user
    (0, otp_utils_1.sendSMS)(phone, otp);
    const userOtp = yield Otp_1.default.findOne({ where: { phoneNumber: phone } });
    if (userOtp) {
        userOtp.otpCode = otp;
        yield userOtp.save();
    }
    else {
        const newUserOtp = new Otp_1.default({
            phoneNumber: phone,
            otpCode: otp,
        });
        yield newUserOtp.save();
    }
    return res.status(200).json({
        message: "OTP sent to user",
    });
}));
exports.sendOtp = sendOtp;
// @desc   Verify phone OTP
// @route  POST /api/v1/auth/verify-phone-otp
const verifyPhoneOTP = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone, otp } = req.body;
    const userOtp = yield Otp_1.default.findOne({ where: { phoneNumber: phone } });
    if (!userOtp) {
        next(new error_response_utils_1.default("OTP is not correct", 401));
        return;
    }
    if (userOtp && userOtp.otpCode !== otp) {
        next(new error_response_utils_1.default("OTP is not correct", 401));
        return;
    }
    const user = yield models_1.User.findOne({ where: { phone_number: phone } });
    if (!user) {
        return next(new error_response_utils_1.default("User not found", 404));
    }
    sendingTokenResponse(user, 200, res);
}));
exports.verifyPhoneOTP = verifyPhoneOTP;
// @desc    get otp users - this is temporary function for testing it will be removed later
// @route   GET /api/v1/auth/otp-users
const getOtpUsers = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield Otp_1.default.findAll();
    res.status(200).json({ users });
}));
exports.getOtpUsers = getOtpUsers;
// ========================Authentication with Email==================================
// @desc    Register user
// @route   POST /api/v1/auth/register
const registerUser = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, first_name, last_name, phone_number, role_name, facebook_id, } = req.body;
    const role = yield models_1.Role.findOne({ where: { name: role_name } });
    if (!role) {
        return next(new error_response_utils_1.default("Role doesn't exist", 400));
    }
    if (req.googleStoragePublicUrl) {
        req.body.image = req.googleStoragePublicUrl;
    }
    // User doesn't exist, create new user
    const user = new models_1.User(Object.assign({ email,
        phone_number,
        first_name,
        last_name, role_id: role.id, facebook_id }, req.body));
    yield user.save();
    // update the otp table user_id
    const userOtp = yield Otp_1.default.findOne({ where: { phoneNumber: phone_number } });
    if (userOtp) {
        userOtp.user_id = user.id;
        yield userOtp.save();
    }
    yield models_1.Incentive.create({
        user_id: user.id,
    });
    // Return token the cookie to the user - cookie is more secure than local storage
    sendingTokenResponse(user, 200, res);
}));
exports.registerUser = registerUser;
// @desc    Check if user exists
// @route   POST /api/v1/auth/login-email
const loginGoogle = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, access_token } = req.body;
    const isValidAccessToken = yield (0, auth_util_1.verfiyAccessToken)(access_token);
    if (!isValidAccessToken) {
        return next(new error_response_utils_1.default("Invalid Access Token", 404));
    }
    const user = yield models_1.User.findOne({ where: { email } });
    if (user) {
        sendingTokenResponse(user, 200, res);
    }
    else {
        return next(new error_response_utils_1.default("User doesn't exist", 404));
    }
}));
exports.loginGoogle = loginGoogle;
// @desc login-facebook
// @route POST /api/v1/auth/login-facebook
const loginFacebook = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { access_token } = req.body;
    const isValidAccessToken = yield (0, auth_util_1.verifyFacebookAccessToken)(access_token);
    if (!isValidAccessToken) {
        return next(new error_response_utils_1.default("Not authorized to verify", 404));
    }
    const userData = yield (0, auth_util_1.getUserDataFromFacebook)(access_token);
    if (!userData) {
        return next(new error_response_utils_1.default("Not authorized to fetch user data", 404));
    }
    const user = yield models_1.User.findOne({
        where: { facebook_id: userData.id },
    });
    if (user) {
        sendingTokenResponse(user, 200, res);
    }
    else {
        return next(new error_response_utils_1.default("User doesn't exist", 404));
    }
}));
exports.loginFacebook = loginFacebook;
// @desc    Get current user
// @route   GET /api/v1/auth/me
const getCurrentUser = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    user = yield models_1.User.findByPk(user === null || user === void 0 ? void 0 : user.id);
    if (!user) {
        return next(new error_response_utils_1.default("User doesn't exist", 400));
    }
    return res.status(200).json({ user });
}));
exports.getCurrentUser = getCurrentUser;
const sendingTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() +
            parseInt(process.env.JWT_COOKIE_EXPIRE || "10") * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === "production") {
        options["secure"] = true;
    }
    const userToSend = {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.phone_number,
        role_id: user.role_id,
        image: user.image,
    };
    res
        .status(statusCode)
        .cookie("token", token, options)
        .json({
        success: true,
        user: Object.assign(Object.assign({}, userToSend), { token }),
    });
};
