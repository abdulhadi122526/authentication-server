import dotenv from "dotenv";
import express from "express";
import connecrDB from "./src/db/index.js";
import userRoutes from "./src/routers/user.route.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", userRoutes);
dotenv.config();


app.get("/", (req, res) => {
  res.send("Hello World!");
 
  
});

connecrDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running  at ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO DB connection failed !!! ", err);
  });
