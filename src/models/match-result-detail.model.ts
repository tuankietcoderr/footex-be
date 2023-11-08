import { Schema, model } from "mongoose"
import { IMatchResultDetail } from "../interface"
import { SCHEMA } from "./schema-name"

const MatchResultDetailModel = new Schema<IMatchResultDetail>(
  {
    goals: [
      {
        type: Schema.Types.ObjectId,
        ref: SCHEMA.GOAL_DETAILS
      }
    ],
    team: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA.TEAMS
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export default model<IMatchResultDetail>(
  SCHEMA.MATCH_RESULTS_DETAILS,
  MatchResultDetailModel,
  SCHEMA.MATCH_RESULTS_DETAILS
)
