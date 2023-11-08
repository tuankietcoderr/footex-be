import { Schema, model } from "mongoose"
import { IPrize } from "../interface"
import { SCHEMA } from "./schema-name"

const PrizeModel = new Schema<IPrize>(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    image: {
      type: String
    },
    refPath: {
      type: String,
      enum: [SCHEMA.GUESTS, SCHEMA.TEAMS],
      default: SCHEMA.TEAMS
    },
    tournament: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA.TOURNAMENTS
    },
    winner: {
      type: Schema.Types.ObjectId,
      refPath: "refPath"
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export default model<IPrize>(SCHEMA.PRIZES, PrizeModel, SCHEMA.PRIZES)
