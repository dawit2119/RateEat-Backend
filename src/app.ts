import cookieParser from "cookie-parser";
import express, { urlencoded } from "express";
import cors from "cors";

// Routes
import userRouter from "./routes/user.route";
import restaurantRouter from "./routes/restaurant.route";
import itemRouter from "./routes/item.route";
import roleRouter from "./routes/role.route";
import authRouter from "./routes/auth.route";
import categoryRouter from "./routes/category.route";
import candidateRestaurantRouter from "./routes/candidate_restaurant.route";
import eatListRouter from "./routes/eat_list.route";
import dotenv from "dotenv";
import path from "path";
import { errorHandler } from "./middlewares/error-handler";
import searchRouter from "./routes/search.route";
import voteRouter from "./routes/vote.route";
import statRouter from "./routes/stat.route";
import reviewRouter from "./routes/review.route";

// Load environment variables
dotenv.config({
  path: path.join(__dirname, "../.env"),
});

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

// body parser and cookie-parser
app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/restaurants", restaurantRouter);
app.use("/api/v1/items", itemRouter);
app.use("/api/v1/roles", roleRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/candidateRestaurants", candidateRestaurantRouter);
app.use("/api/v1/favorites", eatListRouter);
app.use("/api/v1/search", searchRouter);
app.use("/api/v1/votes", voteRouter);
app.use("/api/v1/stats", statRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World!" });
});

export default app;
