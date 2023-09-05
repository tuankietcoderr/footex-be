import { Schema, model } from "mongoose";
import { SCHEMA } from "./schema-name";
import IField from "../interface/IField";

const FieldSchema = new Schema<IField>(
  {
    name: {
      type: String,
    },
    price: {
      type: Number,
    },
    description: {
      type: String,
    },
    is_being_used: {
      type: Boolean,
    },
    footballshop_id: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA.FOOTBALL_SHOPS,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IField>(SCHEMA.FIELDS, FieldSchema);