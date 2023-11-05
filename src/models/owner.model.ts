import { PaginateModel, Schema, model } from "mongoose"
import { IAddress, IOwner } from "../interface"
import { EOwnerStatus } from "../enum"
import paginate from "mongoose-paginate-v2"
import { SCHEMA } from "./schema-name"

const OwnerModel = new Schema<IOwner>(
  {
    status: {
      type: String,
      enum: Object.values(EOwnerStatus),
      default: EOwnerStatus.PENDING
    },
    address: {
      type: Object,
      default: {} as IAddress
    },
    avatar: {
      type: String,
      default: null
    },
    email: {
      type: String,
      required: true
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      required: true
    },
    password: {
      type: String
    },
    phoneNumber: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

OwnerModel.plugin(paginate)

export default model<IOwner, PaginateModel<IOwner>>(SCHEMA.OWNERS, OwnerModel, SCHEMA.OWNERS)
