import app from "./app.js";
import dotenv from "dotenv";
import { connectMongoDatabase } from "./config/db.js";

dotenv.config({ path: "backend/config/config.env" });

connectMongoDatabase();

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Server is shutting down, due to uncaught exception`);
  process.exit(1);
});


const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`server is running on ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`server is shutting down, due to unhandled promise rejection`);
  server.close(() => {
    process.exit(1);
  });
});
