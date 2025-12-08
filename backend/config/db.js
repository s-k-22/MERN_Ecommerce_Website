import mongoose from "mongoose";

export const connectMongoDatabase = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then((data) => {
      console.log(`db is running on ${data.connection.host}`);
    })
    .catch((err) => {
      console.log(err.message);
    });
};
