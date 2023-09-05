import { Request, Response, Router } from "express";
import verifyToken from "../middleware/auth";
import { Types } from "mongoose";
import IFootballShop, { EFootballShopStatus } from "../interface/IFootballShop";
import FootballShop from "../schema/FootballShop";

const router = Router();
const toId = Types.ObjectId;

export default router;
