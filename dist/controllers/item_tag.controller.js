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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllItemTags = exports.createItemTag = exports.getItemTags = void 0;
const models_1 = require("../models");
// Get item_tags in an item
// route items/:itemId/item_tags
const getItemTags = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const itemId = req.params.itemId;
        const item = yield models_1.Item.findByPk(itemId);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        const item_tags = item.item_tags;
        return res.status(200).json({ item_tags });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getItemTags = getItemTags;
// Create an item_tags for an item
// route items/:itemId/item_tags
const createItemTag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { itemId } = req.params;
        const item = yield models_1.Item.findByPk(itemId);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        const name = req.body.name;
        if (!name || typeof name !== "string") {
            return res.status(400).json({ message: "Invalid tag input" });
        }
        // Create a new item_tag with the name and item id
        const item_tag = yield models_1.ItemTag.create({
            name: name,
            item_id: itemId,
        });
        return res.status(201).json({ item_tag });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.createItemTag = createItemTag;
// Get 10 unique item tags or tags that match the searchterm
// route items/item_tags
const getAllItemTags = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { searchterm } = req.query;
        const item_tags = yield models_1.ItemTag.findAll();
        let filtered_item_tags = item_tags;
        if (searchterm) {
            // Filter tags that match the searchterm by name
            filtered_item_tags = item_tags.filter((item_tag) => item_tag.name.toLowerCase().includes(searchterm.toLowerCase()));
        }
        // Get unique item tags by name
        const unique_item_tags = filtered_item_tags.reduce((uniqueTags, item_tag) => {
            const isUnique = !uniqueTags.some((tag) => tag.name === item_tag.name);
            if (isUnique) {
                uniqueTags.push(item_tag);
            }
            return uniqueTags;
        }, []);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const paginated_item_tags = unique_item_tags.slice(offset, offset + limit);
        return res.status(200).json({ item_tags: paginated_item_tags });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.getAllItemTags = getAllItemTags;
