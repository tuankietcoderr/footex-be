import { PaginateModel, Schema, model } from "mongoose"
import { SCHEMA } from "./schema-name"
import mongoosePaginate from "mongoose-paginate-v2"
import { ITeam } from "../interface"

const TeamModel = new Schema<ITeam>(
  {},
  {
    timestamps: true,
    versionKey: false
  }
)

TeamModel.plugin(mongoosePaginate)

export default model<ITeam, PaginateModel<ITeam>>(SCHEMA.TEAMS, TeamModel, SCHEMA.TEAMS)
