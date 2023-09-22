import { Schema, model } from "mongoose"
import IInvitement from "../interface/IInvitement"
import { SCHEMA } from "./schema-name"

const InviteSchema = new Schema<IInvitement>(
  {
    title: {
      type: String
    },
    status: {
      type: String
    },
    team: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA.TEAMS
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA.USERS
    },
    owner_title: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

export default model<IInvitement>(SCHEMA.INVITES, InviteSchema)
