import { Express } from "express";
import authRouter from "../routes/auth";
import guestRouter from "../routes/guest";
import inviteRouter from "../routes/invite";
import footballshopRouter from "../routes/footballshop";
import fieldRouter from "../routes/field";

function getRoutes(app: Express) {
  app.use("/api/user/", authRouter);
  app.use("/api/guest/", guestRouter);
  app.use("/api/invite/", inviteRouter);
  app.use("/api/football-shop/", footballshopRouter);
  app.use("/api/field/", fieldRouter);
}

export default getRoutes;
