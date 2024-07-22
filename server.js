import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connect from "./config/Config.js";
import userRouter from "./routes/UserRoutes.js";
import categoryRouter from "./routes/CategoryRoutes.js";
import colorRouter from "./routes/ColorsRoutes.js";
import productRouter from "./routes/ProductRoutes.js";
import rateRouter from "./routes/RatesRoutes.js";
import clientRouter from "./routes/ClientRoutes.js";
import orderRouter from "./routes/OrderRoutes.js";
import deliveryRouter from "./routes/DeliveryRoutes.js";
import cookieParser from "cookie-parser";
import blogRouter from "./routes/BlogRoutes.js";
import commentRouter from "./routes/CommentRoutes.js";
import dashRouter from "./routes/DashboardRoutes.js";
import gmailRouter from "./routes/GmailRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 6666;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/images", express.static("images"));

const corsOption = {
  // origin: [process.env.FRONT_END_PATH, "https://lalezar-frontend.vercel.app"],
  origin: [
    process.env.FRONT_END_PATH,
    "https://lalezar-ecommerce-frontend.vercel.app",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cookieParser());
app.use(cors(corsOption));
app.use("/user", userRouter);
app.use("/categories", categoryRouter);
app.use("/colors", colorRouter);
app.use("/products", productRouter);
app.use("/rate", rateRouter);
app.use("/client", clientRouter);
app.use("/order", orderRouter);
app.use("/blog", blogRouter);
app.use("/comment", commentRouter);
app.use("/delivery", deliveryRouter);
app.use("/dash", dashRouter);
app.use("/gmail", gmailRouter);

app.listen(PORT, () => {
  connect();
  console.log(`running on port: ${PORT}`);
  if (PORT === 6666) {
    console.log(
      "ERROR: issue reading port from process.env. Continue with caution! ..."
    );
  }
});
