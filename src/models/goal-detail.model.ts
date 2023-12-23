import { Schema, model } from "mongoose"
import { IGoalDetail } from "../interface"
import { SCHEMA } from "./schema-name"

const GoalModel = new Schema<IGoalDetail>(
  {
    scoreAtMinute: {
      type: Number
    },
    scoreBy: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA.GUESTS
    },
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

export default model<IGoalDetail>(SCHEMA.GOAL_DETAILS, GoalModel, SCHEMA.GOAL_DETAILS)
