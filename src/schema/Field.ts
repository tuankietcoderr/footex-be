import { Schema, model } from "mongoose"
import { SCHEMA } from "./schema-name"
import IField from "../interface/IField"

const FieldSchema = new Schema<IField>(
  {
    name: {
      type: String,
      min: [6, "Quá ngắn, tối thiểu 6 ký tự"],
      max: [255, "Quá dài, tối đa 255 ký tự"],
      required: [true, "Vui lòng nhập tên sân bóng"]
    },
    price: {
      type: Number,
      min: [1000, "Giá không được nhỏ hơn 1 nghìn"],
      max: [1000000000, "Giá không được lớn hơn 1 tỷ"],
      required: [true, "Vui lòng nhập giá"]
    },
    description: {
      type: String,
      min: [6, "Quá ngắn, tối thiểu 6 ký tự"],
      max: [5000, "Quá dài, tối đa 5000 ký tự"]
    },
    is_being_used: {
      type: Boolean
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA.ORGANIZATIONS
    }
  },
  {
    timestamps: true
  }
)

export default model<IField>(SCHEMA.FIELDS, FieldSchema)
