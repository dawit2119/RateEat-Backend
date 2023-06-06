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
exports.verifyFacebookAccessToken = exports.getUserDataFromFacebook = exports.verfiyAccessToken = void 0;
const axios_1 = __importDefault(require("axios"));
const verfiyAccessToken = (accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`);
        console.log(response.data);
        const { aud } = response.data;
        if (aud === process.env.GOOGLE_CLIENT_ID) {
            return true;
        }
        return false;
    }
    catch (error) {
        console.log(error);
        throw new Error("Failed to verify access token");
    }
});
exports.verfiyAccessToken = verfiyAccessToken;
const getUserDataFromFacebook = (accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`https://graph.facebook.com/me`, {
            params: {
                access_token: accessToken,
                fields: "id,email", // Specify the fields you want to retrieve
            },
        });
        return response.data;
    }
    catch (error) {
        throw new Error("Failed to retrieve user data from Facebook");
    }
});
exports.getUserDataFromFacebook = getUserDataFromFacebook;
const verifyFacebookAccessToken = (accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`https://graph.facebook.com/debug_token`, {
            params: {
                input_token: accessToken,
                access_token: `${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`,
            },
        });
        const isValid = response.data.data.is_valid;
        return isValid;
    }
    catch (error) {
        throw new Error("Failed to verify access token");
    }
});
exports.verifyFacebookAccessToken = verifyFacebookAccessToken;
