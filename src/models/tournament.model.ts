import { PaginateModel, Schema, model } from "mongoose"
import { SCHEMA } from "./schema-name"
import mongoosePaginate from "mongoose-paginate-v2"
import { ITournament } from "../interface"

const TournamentModel = new Schema<ITournament>(
  {
    branch: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA.BRANCHES
    },
    description: {
      type: String,
      default: null
    },
    endAt: {
      type: Date,
      default: Date.now(),
      min: [Date.now(), "Ngày kết thúc không được nhỏ hơn ngày hiện tại"]
    },
    images: {
      type: [String],
      default: []
    },
    name: {
      type: String,
      required: true
    },
    prize: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA.PRIZES
    },
    startAt: {
      type: Date,
      default: Date.now(),
      min: [Date.now(), "Ngày bắt đầu không được nhỏ hơn ngày hiện tại"]
    },
    teams: [
      {
        type: Schema.Types.ObjectId,
        ref: SCHEMA.TEAMS
      }
    ],
    timelines: [
      {
        type: Schema.Types.ObjectId,
        ref: SCHEMA.MATCHES
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false
  }
)

TournamentModel.plugin(mongoosePaginate)

export default model<ITournament, PaginateModel<ITournament>>(SCHEMA.TOURNAMENTS, TournamentModel, SCHEMA.TOURNAMENTS)
