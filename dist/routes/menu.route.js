"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const menu_controller_1 = require("../controllers/menu.controller");
const router = express_1.default.Router({ mergeParams: true });
router.route("/").get(menu_controller_1.getMenu).post(menu_controller_1.createMenu).put(menu_controller_1.updateMenu);
exports.default = router;
