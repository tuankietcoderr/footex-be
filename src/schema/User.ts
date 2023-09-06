import { Schema, model } from "mongoose"
import { SCHEMA } from "./schema-name"
import IUser from "../interface/IUser"

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      unique: true
    },
    password: {
      type: String
    },
    role: {
      type: String
    },
    email: {
      type: String
    },
    avatar: {
      type: String
    },
    name: {
      type: String
    },
    phone_number: {
      type: String
    },
    teams: [
      {
        type: Schema.Types.ObjectId,
        ref: SCHEMA.TEAMS
      }
    ]
  },
  {
    timestamps: true
  }
)

export default model<IUser>(SCHEMA.USERS, UserSchema)
