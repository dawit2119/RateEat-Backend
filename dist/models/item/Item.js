"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const sequelize_typescript_1 = require("sequelize-typescript");
const Category_1 = __importDefault(require("../menu/Category"));
const ItemReview_1 = __importDefault(require("./ItemReview"));
const ItemImage_1 = __importDefault(require("./ItemImage"));
const ItemVideo_1 = __importDefault(require("./ItemVideo"));
const Ingredient_1 = __importDefault(require("./Ingredient"));
const ItemTag_1 = __importDefault(require("./ItemTag"));
let Item = class Item extends sequelize_typescript_1.Model {
    // method to increment item popularity number by 1
    incrementPopularity() {
        return __awaiter(this, void 0, void 0, function* () {
            this.popularity_index += 1;
            yield this.save();
        });
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4,
        allowNull: false,
    }),
    __metadata("design:type", String)
], Item.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(50),
        defaultValue: "",
    }),
    __metadata("design:type", String)
], Item.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        defaultValue: "",
    }),
    __metadata("design:type", String)
], Item.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], Item.prototype, "number_of_reviews", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DOUBLE,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], Item.prototype, "average_rating", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DOUBLE,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], Item.prototype, "price", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Category_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], Item.prototype, "category_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], Item.prototype, "fasting", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Category_1.default, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Category_1.default)
], Item.prototype, "categories", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => ItemReview_1.default, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Array)
], Item.prototype, "item_reviews", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => ItemImage_1.default, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Array)
], Item.prototype, "item_images", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => ItemVideo_1.default, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Array)
], Item.prototype, "item_videos", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => ItemTag_1.default, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Array)
], Item.prototype, "item_tags", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Ingredient_1.default, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Array)
], Item.prototype, "ingredients", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], Item.prototype, "popularity_index", void 0);
Item = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "items",
        timestamps: true,
    })
], Item);
exports.default = Item;
