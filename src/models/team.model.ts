import { PaginateModel, Schema, model } from "mongoose"
import { SCHEMA } from "./schema-name"
import mongoosePaginate from "mongoose-paginate-v2"
import { ITeam } from "../interface"
import { ETeamStatus } from "../enum"

const TeamModel = new Schema<ITeam>(
  {
    captain: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA.GUESTS
    },
    description: {
      type: String,
      default: null
    },
    images: {
      type: [String],
      default: []
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
    ],
    joinRequests: [
      {
        type: Schema.Types.ObjectId,
        ref: SCHEMA.INVITEMENTS
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
