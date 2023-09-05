import { Schema, model } from "mongoose";
import { SCHEMA } from "./schema-name";
import IFootballShop, { EFootballShopStatus } from "../interface/IFootballShop";

const FootballShopSchema = new Schema<IFootballShop>(
  {
    email: {
      type: String,
    },
    images: {
      type: [String],
    },
    logo: {
      type: String,
    },
    name: {
      type: String,
    },
    address: {
      type: String,
    },
    phone_number: {
      type: String,
    },
    owner_id: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA.USERS,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
    },
    active_at: {
      type: Number,
    },
    inactive_at: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IFootballShop>(SCHEMA.FOOTBALL_SHOPS, FootballShopSchema);
