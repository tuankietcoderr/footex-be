import { PaginateModel, Schema, Types, model } from "mongoose"
import { SCHEMA } from "./schema-name"
import { IFieldBookedQueue } from "../interface"
import mongoosePaginate from "mongoose-paginate-v2"

const FieldBookedQueueModel = new Schema<IFieldBookedQueue>(
  {},
  {
    versionKey: false,
    timestamps: true
  }
)

FieldBookedQueueModel.plugin(mongoosePaginate)
export default model<IFieldBookedQueue, PaginateModel<IFieldBookedQueue>>(
  SCHEMA.FIELD_BOOKED_QUEUES,
  FieldBookedQueueModel,
  SCHEMA.FIELD_BOOKED_QUEUES
)
