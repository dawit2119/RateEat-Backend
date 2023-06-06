"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const item_tag_controller_1 = require("../controllers/item_tag.controller");
const router = (0, express_1.Router)({ mergeParams: true });
router.route("/").get(item_tag_controller_1.getItemTags).post(item_tag_controller_1.createItemTag);
exports.default = router;
