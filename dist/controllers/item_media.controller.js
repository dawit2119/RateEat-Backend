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
exports.getItemMedia = exports.createItemMedia = void 0;
const async_handler_1 = __importDefault(require("../middlewares/async-handler"));
const models_1 = require("../models");
// desc get all item's media
// route GET /items/:itemId/media
const getItemMedia = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item_id = req.params.itemId;
        const itemImages = yield models_1.ItemImage.findAll({
            where: { item_id: item_id },
            attributes: ['url']
        });
        const itemVideos = yield models_1.ItemVideo.findAll({
            where: { item_id: item_id },
            attributes: ['url']
        });
        res.status(200).json({
            item_id,
            itemImages: itemImages,
            itemVideos: itemVideos
        });
    }
    catch (error) {
        console.log(next(error));
    }
}));
exports.getItemMedia = getItemMedia;
// desc create a new media for an item
// route POST /items/:itemId/media
const createItemMedia = (0, async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item_id = req.params.itemId;
        const item = yield models_1.Item.findOne({
            where: { id: item_id }
        });
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        if (req.mediaImages) {
            const itemImages = req.mediaImages;
            for (let i = 0; i < itemImages.length; i++) {
                yield models_1.ItemImage.create({
                    url: itemImages[i],
                    item_id: item_id
                });
            }
        }
        if (req.mediaVideos) {
            const itemVideos = req.mediaVideos;
            for (let i = 0; i < itemVideos.length; i++) {
                yield models_1.ItemVideo.create({
                    url: itemVideos[i],
                    item_id: item_id
                });
            }
        }
        return res
            .status(201)
            .json({ message: "Medias created successfully" });
    }
    catch (error) {
        return next(error);
    }
}));
exports.createItemMedia = createItemMedia;
