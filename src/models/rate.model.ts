import { Schema, model } from "mongoose"
import { IRate } from "../interface"
import { SCHEMA } from "./schema-name"

const RateModel = new Schema<IRate>({
  valuer: {
    type: Schema.Types.ObjectId,
    ref: SCHEMA.GUESTS
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
    min: 0,
    max: 5,
    default: 0
  }
})

export default model<IRate>(SCHEMA.RATES, RateModel, SCHEMA.RATES)
