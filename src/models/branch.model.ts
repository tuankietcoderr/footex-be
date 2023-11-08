import { PaginateModel, Schema, Types, model } from "mongoose"
import { SCHEMA } from "./schema-name"
import mongoosePaginate from "mongoose-paginate-v2"
import { IAddress, IBranch } from "../interface"
import { EBranchStatus } from "../enum"

const BranchModel = new Schema<IBranch>(
  {
    name: {
      type: String
    },
    images: {
      type: [String]
    },
    logo: {
      type: String
    },
    description: {
      type: String
    },
    openAt: {
      type: Number
    },
    closeAt: {
      type: Number
    },
    status: {
      type: String,
      enum: Object.values(EBranchStatus),
      default: EBranchStatus.ACTIVE
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA.OWNERS
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
    },
    phoneNumber: {
      type: String
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

BranchModel.plugin(mongoosePaginate)

export default model<IBranch, PaginateModel<IBranch>>(SCHEMA.BRANCHES, BranchModel)
