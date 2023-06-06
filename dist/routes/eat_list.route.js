"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const eat_list_controller_1 = require("../controllers/eat_list.controller");
const router = express_1.default.Router({ mergeParams: true });
router.route("/").get(eat_list_controller_1.getUserFavorites).post(eat_list_controller_1.addItemToFavorites);
router.route("/:itemId").delete(eat_list_controller_1.removeItemFromFavorites);
exports.default = router;
