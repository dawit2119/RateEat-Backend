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
const sequelize_typescript_1 = require("sequelize-typescript");
const Restaurant_1 = __importDefault(require("./Restaurant"));
const User_1 = __importDefault(require("../user/User"));
const RestaurantReviewImage_1 = __importDefault(require("./RestaurantReviewImage"));
const RestaurantReviewVideo_1 = __importDefault(require("./RestaurantReviewVideo"));
let RestaurantReview = class RestaurantReview extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4,
        allowNull: false,
    }),
    __metadata("design:type", String)
], RestaurantReview.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Restaurant_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], RestaurantReview.prototype, "restaurant_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], RestaurantReview.prototype, "user_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DOUBLE,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], RestaurantReview.prototype, "rating", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
    }),
    __metadata("design:type", String)
], RestaurantReview.prototype, "comment", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], RestaurantReview.prototype, "up_vote", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], RestaurantReview.prototype, "down_vote", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: true,
    }),
    __metadata("design:type", Boolean)
], RestaurantReview.prototype, "visibility", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Restaurant_1.default, {
        foreignKey: "restaurant_id",
        as: "restaurant",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    }),
    __metadata("design:type", Restaurant_1.default)
], RestaurantReview.prototype, "restaurant", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.default),
    __metadata("design:type", User_1.default)
], RestaurantReview.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => RestaurantReviewImage_1.default, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Array)
], RestaurantReview.prototype, "restaurant_review_images", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => RestaurantReviewVideo_1.default, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    }),
    __metadata("design:type", Array)
], RestaurantReview.prototype, "restaurant_review_videos", void 0);
RestaurantReview = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "restaurant_reviews",
        timestamps: true,
    })
], RestaurantReview);
exports.default = RestaurantReview;
