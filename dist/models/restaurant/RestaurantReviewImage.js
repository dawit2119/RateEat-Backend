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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// RestaurantReviewImage.ts
const sequelize_typescript_1 = require("sequelize-typescript");
const RestaurantReview_1 = __importDefault(require("./RestaurantReview"));
let RestaurantReviewImage = class RestaurantReviewImage extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4,
        allowNull: false,
    }),
    __metadata("design:type", String)
], RestaurantReviewImage.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        allowNull: false,
    }),
    __metadata("design:type", String)
], RestaurantReviewImage.prototype, "url", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => RestaurantReview_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], RestaurantReviewImage.prototype, "restaurant_review_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => RestaurantReview_1.default, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    }),
    __metadata("design:type", RestaurantReview_1.default)
], RestaurantReviewImage.prototype, "restaurant_review", void 0);
RestaurantReviewImage = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "restaurant_review_images",
        timestamps: true,
    })
], RestaurantReviewImage);
exports.default = RestaurantReviewImage;
