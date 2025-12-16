import express from "express";
import product from "./routes/productRoutes.js";
import user from "./routes/userRoutes.js";
import errorHandlerMiddleware from "./middleware/error.js";
import cookieParser from "cookie-parser";

const app = express();

//body parser middleware -> converts json data(sent from frontend/postman) to js object(readable/to store in db)
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", product);
app.use("/api/v1", user);

//error handler - write at last always
app.use(errorHandlerMiddleware);

export default app;
