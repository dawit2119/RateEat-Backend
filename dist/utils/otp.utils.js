"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSMS = exports.generateOTP = void 0;
const otp_generator_1 = __importDefault(require("otp-generator"));
const axios_1 = __importDefault(require("axios"));
const generateOTP = (length) => {
    return otp_generator_1.default.generate(length, {
        digits: true,
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
    });
};
exports.generateOTP = generateOTP;
const sendSMS = (phone, msg) => {
    (0, axios_1.default)({
        url: process.env.SMS_URL,
        method: "POST",
        data: {
            msg: msg,
            phone: phone,
            token: process.env.SMS_TOKEN,
        },
    })
        .then((response) => {
        console.log(response.data.url);
    })
        .catch((error) => {
        console.log(error);
    });
};
exports.sendSMS = sendSMS;
