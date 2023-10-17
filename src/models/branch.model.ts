import { PaginateModel, Schema, model } from "mongoose"
import { SCHEMA } from "./schema-name"
import mongoosePaginate from "mongoose-paginate-v2"
import { IBranch } from "../interface"

const BranchModel = new Schema<IBranch>(
  {},
  {
    timestamps: true,
    versionKey: false
  }
)

BranchModel.plugin(mongoosePaginate)

export default model<IBranch, PaginateModel<IBranch>>(SCHEMA.BRANCHES, BranchModel)
