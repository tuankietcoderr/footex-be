import { Schema, model } from "mongoose"
import { IAddress, IGuest } from "../interface"
import { EGuestStatus } from "../enum"
import { SCHEMA } from "./schema-name"

const GuestModel = new Schema<IGuest>(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    address: {
      type: Object,
      default: {} as IAddress
    },
    avatar: {
      type: String,
      default: null
    },
    name: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(EGuestStatus),
      default: EGuestStatus.ACTIVE
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export default model<IGuest>(SCHEMA.GUESTS, GuestModel, SCHEMA.GUESTS)
