"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importStar(require("express"));
const cors_1 = __importDefault(require("cors"));
// Routes
const user_route_1 = __importDefault(require("./routes/user.route"));
const restaurant_route_1 = __importDefault(require("./routes/restaurant.route"));
const item_route_1 = __importDefault(require("./routes/item.route"));
const role_route_1 = __importDefault(require("./routes/role.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const category_route_1 = __importDefault(require("./routes/category.route"));
const candidate_restaurant_route_1 = __importDefault(require("./routes/candidate_restaurant.route"));
const eat_list_route_1 = __importDefault(require("./routes/eat_list.route"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const error_handler_1 = require("./middlewares/error-handler");
const search_route_1 = __importDefault(require("./routes/search.route"));
const vote_route_1 = __importDefault(require("./routes/vote.route"));
const stat_route_1 = __importDefault(require("./routes/stat.route"));
const review_route_1 = __importDefault(require("./routes/review.route"));
// Load environment variables
dotenv_1.default.config({
    path: path_1.default.join(__dirname, "../.env"),
});
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "*",
}));
// body parser and cookie-parser
app.use((0, express_1.urlencoded)({ extended: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/v1/users", user_route_1.default);
app.use("/api/v1/restaurants", restaurant_route_1.default);
app.use("/api/v1/items", item_route_1.default);
app.use("/api/v1/roles", role_route_1.default);
app.use("/api/v1/auth", auth_route_1.default);
app.use("/api/v1/categories", category_route_1.default);
app.use("/api/v1/candidateRestaurants", candidate_restaurant_route_1.default);
app.use("/api/v1/favorites", eat_list_route_1.default);
app.use("/api/v1/search", search_route_1.default);
app.use("/api/v1/votes", vote_route_1.default);
app.use("/api/v1/stats", stat_route_1.default);
app.use("/api/v1/reviews", review_route_1.default);
app.use(error_handler_1.errorHandler);
app.get("/", (req, res) => {
    res.status(200).json({ message: "Hello World!" });
});
exports.default = app;
