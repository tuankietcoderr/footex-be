import { Schema, model } from "mongoose"
import { IMatch } from "../interface"
import { SCHEMA } from "./schema-name"

const MatchModel = new Schema<IMatch>(
  {
    startAt: {
      type: Date,
      default: Date.now()
    },
    endAt: {
      type: Date,
      default: Date.now()
    },
    leftTeam: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA.TEAMS
    },
    rightTeam: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA.TEAMS
    },
    field: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA.FIELDS
    },
    tournament: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA.TOURNAMENTS
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export default model<IMatch>(SCHEMA.MATCHES, MatchModel, SCHEMA.MATCHES)
