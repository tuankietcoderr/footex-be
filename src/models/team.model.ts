import { PaginateModel, Schema, model } from "mongoose"
import { SCHEMA } from "./schema-name"
import mongoosePaginate from "mongoose-paginate-v2"
import { ITeam } from "../interface"
import { ETeamStatus } from "../enum"

const TeamModel = new Schema<ITeam>(
  {
    captain: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA.USERS
    },
    description: {
      type: String,
      default: null
    },
    image: {
      type: String,
      default: null
    },
    logo: {
      type: String,
      default: null
    },
    name: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(ETeamStatus),
      default: ETeamStatus.ACTIVE
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: SCHEMA.GUESTS
      }
    ],
    jointTournaments: [
      {
        type: Schema.Types.ObjectId,
        ref: SCHEMA.TOURNAMENTS
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false
  }
)

TeamModel.plugin(mongoosePaginate)

export default model<ITeam, PaginateModel<ITeam>>(SCHEMA.TEAMS, TeamModel, SCHEMA.TEAMS)
