import { PaginateModel, Schema, model } from "mongoose"
import { SCHEMA } from "./schema-name"
import mongoosePaginate from "mongoose-paginate-v2"
import { IField } from "../interface"

const FieldModel = new Schema<IField>(
  {},
  {
    timestamps: true,
    versionKey: false
  }
)

FieldModel.plugin(mongoosePaginate)

export default model<IField, PaginateModel<IField>>(SCHEMA.FIELDS, FieldModel, SCHEMA.FIELDS)
