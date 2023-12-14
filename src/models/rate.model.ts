import { Schema, model } from "mongoose"
import { IRate } from "../interface"
import { SCHEMA } from "./schema-name"

const RateModel = new Schema<IRate>(
  {
    valuer: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA.GUESTS,
      default: null
    },
    description: {
      type: String
    },
    object: {
      type: Schema.Types.ObjectId,
      ref: "refPath"
    },
    refPath: {
      type: String,
      enum: [SCHEMA.TEAMS, SCHEMA.FIELDS, SCHEMA.BRANCHES],
      default: SCHEMA.FIELDS
    },
    rateValue: {
      type: Number,
      min: [0, "Đánh giá không được nhỏ hơn 0"],
      max: [5, "Đánh giá không được lớn hơn 5"],
      default: 1
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export default model<IRate>(SCHEMA.RATES, RateModel, SCHEMA.RATES)
