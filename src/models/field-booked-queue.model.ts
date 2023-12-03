import { PaginateModel, Schema, Types, model } from "mongoose"
import { SCHEMA } from "./schema-name"
import { IFieldBookedQueue } from "../interface"
import mongoosePaginate from "mongoose-paginate-v2"
import { EFieldBookedQueueStatus } from "../enum"

const FieldBookedQueueModel = new Schema<IFieldBookedQueue>(
  {
    bookedBy: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA.GUESTS
    },
    field: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA.FIELDS
    },
    status: {
      type: String,
      enum: Object.values(EFieldBookedQueueStatus),
      default: EFieldBookedQueueStatus.PENDING
    },
    startAt: {
      type: Date,
      default: Date.now()
    },
    endAt: {
      type: Date,
      default: Date.now()
    }
  },
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
