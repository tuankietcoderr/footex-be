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
    branch: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA.BRANCHES
    },
    winners: [
      {
        type: Schema.Types.ObjectId,
        ref: SCHEMA.TEAMS
      }
    ],
    value: {
      type: Number,
      default: 0
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export default model<IPrize>(SCHEMA.PRIZES, PrizeModel, SCHEMA.PRIZES)
