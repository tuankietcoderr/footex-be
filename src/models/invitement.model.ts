import { PaginateModel, Schema, Types, model } from "mongoose"
import { SCHEMA } from "./schema-name"
import mongoosePaginate from "mongoose-paginate-v2"
import { IInvitement } from "../interface"
import { EInvitementStatus } from "../enum"

const InviteModel = new Schema<IInvitement>(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA.USERS
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA.USERS
    },
    team: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA.TEAMS
    },
    status: {
      type: String,
      enum: Object.values(EInvitementStatus),
      default: EInvitementStatus.PENDING
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

InviteModel.plugin(mongoosePaginate)

export default model<IInvitement, PaginateModel<IInvitement>>(SCHEMA.INVITEMENTS, InviteModel, SCHEMA.INVITEMENTS)
