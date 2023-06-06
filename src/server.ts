import sequelize from "./config/db";
import app from "./app";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({
  path: path.join(__dirname, "../.env"),
});


// Drop and create the database tables
async function start() {
  sequelize
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");
    })
    .catch((error) => {
      console.error("Unable to connect to the database:", error);
    });

  const PORT = process.env.ENV_PORT || "8000"

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

start();
