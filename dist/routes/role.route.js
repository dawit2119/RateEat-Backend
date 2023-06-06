"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const role_controller_1 = require("../controllers/role.controller");
const router = express_1.default.Router();
router.route("/").get(role_controller_1.getRoles).post(role_controller_1.createRole);
router.route("/:id").delete(role_controller_1.deleteRole);
exports.default = router;
