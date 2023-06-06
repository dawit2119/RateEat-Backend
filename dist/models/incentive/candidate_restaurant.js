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
const User_1 = __importDefault(require("../user/User"));
const candidate_restaurant_tag_1 = __importDefault(require("./candidate_restaurant_tag"));
const candidate_restaurant_location_1 = __importDefault(require("./candidate_restaurant_location"));
const candidate_restaurant_menu_image_1 = __importDefault(require("./candidate_restaurant_menu_image"));
const candidate_restaurant_license_image_1 = __importDefault(require("./candidate_restaurant_license_image"));
let CandidateRestaurant = class CandidateRestaurant extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4,
        allowNull: false,
    }),
    __metadata("design:type", String)
], CandidateRestaurant.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(128),
        allowNull: false,
    }),
    __metadata("design:type", String)
], CandidateRestaurant.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TIME,
        defaultValue: "08:00:00",
    }),
    __metadata("design:type", Date)
], CandidateRestaurant.prototype, "opening_hour", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TIME,
        defaultValue: "22:00:00",
    }),
    __metadata("design:type", Date)
], CandidateRestaurant.prototype, "closing_hour", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], CandidateRestaurant.prototype, "is_open", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], CandidateRestaurant.prototype, "is_approved", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], CandidateRestaurant.prototype, "is_rejected", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false
    }),
    __metadata("design:type", String)
], CandidateRestaurant.prototype, "user_id", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => candidate_restaurant_tag_1.default, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Array)
], CandidateRestaurant.prototype, "candidate_restaurant_tags", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => candidate_restaurant_location_1.default, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    }),
    __metadata("design:type", Array)
], CandidateRestaurant.prototype, "candidate_restaurant_locations", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => candidate_restaurant_menu_image_1.default, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Array)
], CandidateRestaurant.prototype, "candidate_restaurant_menu_images", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => candidate_restaurant_license_image_1.default, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Array)
], CandidateRestaurant.prototype, "candidate_restaurant_license", void 0);
CandidateRestaurant = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "candidate_restaurants",
        timestamps: true,
    })
], CandidateRestaurant);
exports.default = CandidateRestaurant;
