import { PaginateModel, Schema, model } from "mongoose"
import { SCHEMA } from "./schema-name"
import mongoosePaginate from "mongoose-paginate-v2"
import { IField } from "../interface"
import { BranchModel } from "."
import { EFieldStatus } from "../enum"
import { CustomError, HttpStatusCode } from "../helper"

const FieldModel = new Schema<IField>(
  {
    branch: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA.BRANCHES
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    image: {
      type: String,
      default: null
    },
    status: {
      type: String,
      enum: Object.values(EFieldStatus),
      default: EFieldStatus.ACTIVE
    },
    type: {
      type: Number,
      default: 5
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
).pre("save", async function (next) {
  const branch = await BranchModel.findById(this.branch)
  if (!branch) return Promise.reject(new CustomError("Không tìm thấy chi nhánh", HttpStatusCode.BAD_REQUEST))
  return next()
})

FieldModel.plugin(mongoosePaginate)

export default model<IField, PaginateModel<IField>>(SCHEMA.FIELDS, FieldModel, SCHEMA.FIELDS)
