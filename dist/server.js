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
const db_1 = __importDefault(require("./config/db"));
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables
dotenv_1.default.config({
    path: path_1.default.join(__dirname, "../.env"),
});
// Drop and create the database tables
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        db_1.default
            .authenticate()
            .then(() => {
            console.log("Connection has been established successfully.");
        })
            .catch((error) => {
            console.error("Unable to connect to the database:", error);
        });
        const PORT = process.env.ENV_PORT || "8000";
        app_1.default.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    });
}
start();
