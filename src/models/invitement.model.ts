import { PaginateModel, Schema, model } from "mongoose"
import { SCHEMA } from "./schema-name"
import mongoosePaginate from "mongoose-paginate-v2"
import { IInvitement } from "../interface"

const InviteModel = new Schema<IInvitement>(
  {},
  {
    timestamps: true,
    versionKey: false
  }
)

InviteModel.plugin(mongoosePaginate)

export default model<IInvitement, PaginateModel<IInvitement>>(SCHEMA.INVITEMENTS, InviteModel, SCHEMA.INVITEMENTS)
