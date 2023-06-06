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
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const __1 = require("..");
let ItemReview = class ItemReview extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4,
        allowNull: false,
    }),
    __metadata("design:type", String)
], ItemReview.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => __1.Item),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], ItemReview.prototype, "item_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => __1.User),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], ItemReview.prototype, "user_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DOUBLE,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], ItemReview.prototype, "rating", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
        defaultValue: "",
    }),
    __metadata("design:type", String)
], ItemReview.prototype, "comment", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], ItemReview.prototype, "up_vote", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], ItemReview.prototype, "down_vote", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], ItemReview.prototype, "visibility", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => __1.Item),
    __metadata("design:type", __1.Item)
], ItemReview.prototype, "item", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => __1.User),
    __metadata("design:type", __1.User)
], ItemReview.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => __1.ItemReviewImage, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Array)
], ItemReview.prototype, "item_review_images", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => __1.ItemReviewVideo, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Array)
], ItemReview.prototype, "item_review_videos", void 0);
ItemReview = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "item_reviews",
        timestamps: true,
    })
], ItemReview);
exports.default = ItemReview;
