import { NextFunction, Request, Response } from "express";
import { Incentive, Role, User } from "../models";
import { generateOTP, sendSMS } from "../utils/otp.utils";
import Otp from "../models/OTP/Otp";
import asyncAwaitHandler from "../middlewares/async-handler";
import ErrorResponse from "../utils/error-response.utils";
import { FileRequest } from "../middlewares/upload-image";
import {
  verfiyAccessToken,
  verifyFacebookAccessToken,
  getUserDataFromFacebook,
} from "../utils/auth.util";

// ========================Authentication with Phone==================================
// @desc send otp to user
// @route POST /api/v1/auth/send-otp
const sendOtp = asyncAwaitHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { phone } = req.body;
    if (!phone) {
      return next(new ErrorResponse("Phone number is required", 400));
    }
    const otp = generateOTP(4);
    // send otp to user
    sendSMS(phone, otp);
    const userOtp = await Otp.findOne({ where: { phoneNumber: phone } });
    if (userOtp) {
      userOtp.otpCode = otp;
      await userOtp.save();
    } else {
      const newUserOtp = new Otp({
        phoneNumber: phone,
        otpCode: otp,
      });
      await newUserOtp.save();
    }
    return res.status(200).json({
      message: "OTP sent to user",
    });
  }
);

// @desc   Verify phone OTP
// @route  POST /api/v1/auth/verify-phone-otp
const verifyPhoneOTP = asyncAwaitHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { phone, otp } = req.body;
    const userOtp = await Otp.findOne({ where: { phoneNumber: phone } });

    if (!userOtp) {
      next(new ErrorResponse("OTP is not correct", 401));
      return;
    }

    if (userOtp && userOtp.otpCode !== otp) {
      next(new ErrorResponse("OTP is not correct", 401));
      return;
    }

    const user = await User.findOne({ where: { phone_number: phone } });
    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }
    sendingTokenResponse(user, 200, res);
  }
);

// @desc    get otp users - this is temporary function for testing it will be removed later
// @route   GET /api/v1/auth/otp-users
const getOtpUsers = asyncAwaitHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await Otp.findAll();
    res.status(200).json({ users });
  }
);

// ========================Authentication with Email==================================
// @desc    Register user
// @route   POST /api/v1/auth/register
const registerUser = asyncAwaitHandler(
  async (req: FileRequest, res: Response, next: NextFunction) => {
    const {
      email,
      first_name,
      last_name,
      phone_number,
      role_name,
      facebook_id,
    } = req.body;

    const role = await Role.findOne({ where: { name: role_name } });
    if (!role) {
      return next(new ErrorResponse("Role doesn't exist", 400));
    }

    if (req.googleStoragePublicUrl) {
      req.body.image = req.googleStoragePublicUrl;
    }
    // User doesn't exist, create new user
    const user = new User({
      email,
      phone_number,
      first_name,
      last_name,
      role_id: role.id,
      facebook_id,
      ...req.body,
    });
    await user.save();

    // update the otp table user_id
    const userOtp = await Otp.findOne({ where: { phoneNumber: phone_number } });
    if (userOtp) {
      userOtp.user_id = user.id;
      await userOtp.save();
    }

    await Incentive.create({
      user_id: user.id,
    });

    // Return token the cookie to the user - cookie is more secure than local storage
    sendingTokenResponse(user, 200, res);
  }
);

// @desc    Check if user exists
// @route   POST /api/v1/auth/login-email
const loginGoogle = asyncAwaitHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, access_token } = req.body;
    const isValidAccessToken = await verfiyAccessToken(access_token);

    if (!isValidAccessToken) {
      return next(new ErrorResponse("Invalid Access Token", 404));
    }
    const user = await User.findOne({ where: { email } });
    if (user) {
      sendingTokenResponse(user, 200, res);
    } else {
      return next(new ErrorResponse("User doesn't exist", 404));
    }
  }
);

// @desc login-facebook
// @route POST /api/v1/auth/login-facebook
const loginFacebook = asyncAwaitHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { access_token } = req.body;
    const isValidAccessToken = await verifyFacebookAccessToken(access_token);

    if (!isValidAccessToken) {
      return next(new ErrorResponse("Not authorized to verify", 404));
    }

    const userData = await getUserDataFromFacebook(access_token);
    if (!userData) {
      return next(new ErrorResponse("Not authorized to fetch user data", 404));
    }

    const user = await User.findOne({
      where: { facebook_id: userData.id },
    });
    if (user) {
      sendingTokenResponse(user, 200, res);
    } else {
      return next(new ErrorResponse("User doesn't exist", 404));
    }
  }
);

// @desc    Get current user
// @route   GET /api/v1/auth/me
const getCurrentUser = asyncAwaitHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let user: any = req.user;
    user = await User.findByPk(user?.id);
    if (!user) {
      return next(new ErrorResponse("User doesn't exist", 400));
    }
    return res.status(200).json({ user });
  }
);

const sendingTokenResponse = (user: User, statusCode: any, res: Response) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() +
        parseInt(process.env.JWT_COOKIE_EXPIRE || "10") * 24 * 60 * 60 * 1000
    ),
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
      user: {
        ...userToSend,
        token,
      },
    });
};

export {
  sendOtp,
  verifyPhoneOTP,
  getOtpUsers,
  registerUser,
  loginGoogle,
  getCurrentUser,
  loginFacebook,
};
