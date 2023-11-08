import { Schema, model } from "mongoose"
import { IMatchResult } from "../interface"
import { SCHEMA } from "./schema-name"

const MatchResultModel = new Schema<IMatchResult>(
  {
    match: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA.MATCHES
    },
    leftTeam: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA.TEAMS
    },
    rightTeam: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA.TEAMS
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export default model<IMatchResult>(SCHEMA.MATCH_RESULTS, MatchResultModel, SCHEMA.MATCH_RESULTS)
