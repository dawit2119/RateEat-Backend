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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
const protectRoute = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(" ")[1];
    }
    //  else if (req.cookies.token) {
    //     // Set token from cookie
    //     token = req.cookies.token;
    //   }
    // Make sure token exists
    if (!token) {
        return res
            .status(401)
            .json({ error: "Not authorized to access this route" });
    }
    try {
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "");
        req.user = yield models_1.User.findByPk(decoded.id);
        next();
    }
    catch (error) {
        console.error(error);
        return res
            .status(401)
            .json({ error: "Not authorized to access this route" });
    }
});
exports.default = protectRoute;
