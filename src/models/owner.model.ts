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
    phoneNumber: {
      type: String,
      required: true
    },
    city: {
      type: String
    },
    district: {
      type: String
    },
    ward: {
      type: String
    },
    street: {
      type: String
    },
    houseNumber: {
      type: String
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

OwnerModel.plugin(paginate)

export default model<IOwner, PaginateModel<IOwner>>(SCHEMA.OWNERS, OwnerModel, SCHEMA.OWNERS)
