import { Types } from "mongoose";
import IFootballShop from "./IFootballShop";

export default interface IField {
  footballshop_id?: Types.ObjectId | IFootballShop;
  name: string;
  price?: number;
  description?: string;
  is_being_used?: boolean;
}
