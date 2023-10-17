import { PaginateModel, Schema, model } from "mongoose"
import { SCHEMA } from "./schema-name"
import mongoosePaginate from "mongoose-paginate-v2"
import { ITournament } from "../interface"

const TournamentModel = new Schema<ITournament>(
  {},
  {
    timestamps: true,
    versionKey: false
  }
)

TournamentModel.plugin(mongoosePaginate)

export default model<ITournament, PaginateModel<ITournament>>(SCHEMA.TOURNAMENTS, TournamentModel, SCHEMA.TOURNAMENTS)
