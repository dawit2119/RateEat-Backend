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
const User_1 = __importDefault(require("../user/User"));
const Menu_1 = __importDefault(require("../menu/Menu"));
const RestaurantReview_1 = __importDefault(require("./RestaurantReview"));
const RestaurantLocation_1 = __importDefault(require("./RestaurantLocation"));
const RestaurantImage_1 = __importDefault(require("./RestaurantImage"));
const RestaurantVideo_1 = __importDefault(require("./RestaurantVideo"));
const RestaurantPhoneNumber_1 = __importDefault(require("./RestaurantPhoneNumber"));
const RestaurantAdditionalService_1 = __importDefault(require("./RestaurantAdditionalService"));
const RestaurantTag_1 = __importDefault(require("./RestaurantTag"));
let Restaurant = class Restaurant extends sequelize_typescript_1.Model {
    incrementPopularity() {
        return __awaiter(this, void 0, void 0, function* () {
            this.popularity_index++;
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
], Restaurant.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(128),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Restaurant.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TIME,
        defaultValue: "10:00:00",
    }),
    __metadata("design:type", Date)
], Restaurant.prototype, "opening_hour", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TIME,
        defaultValue: "22:00:00",
    }),
    __metadata("design:type", Date)
], Restaurant.prototype, "closing_hour", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], Restaurant.prototype, "is_open", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DOUBLE,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], Restaurant.prototype, "average_price", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DOUBLE,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], Restaurant.prototype, "average_rating", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], Restaurant.prototype, "number_of_reviews", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], Restaurant.prototype, "popularity_index", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
    }),
    __metadata("design:type", String)
], Restaurant.prototype, "user_id", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => Menu_1.default, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    }),
    __metadata("design:type", Array)
], Restaurant.prototype, "menu", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => RestaurantReview_1.default, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    }),
    __metadata("design:type", Array)
], Restaurant.prototype, "restaurant_reviews", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => RestaurantImage_1.default, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Array)
], Restaurant.prototype, "restaurant_images", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => RestaurantVideo_1.default, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Array)
], Restaurant.prototype, "restaurant_videos", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => RestaurantTag_1.default, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Array)
], Restaurant.prototype, "restaurant_tags", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => RestaurantLocation_1.default, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    }),
    __metadata("design:type", Array)
], Restaurant.prototype, "restaurant_locations", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => RestaurantPhoneNumber_1.default, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Array)
], Restaurant.prototype, "restaurant_phone_numbers", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => RestaurantAdditionalService_1.default, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Array)
], Restaurant.prototype, "restaurant_additional_services", void 0);
Restaurant = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "restaurants",
        timestamps: true,
    })
], Restaurant);
exports.default = Restaurant;
