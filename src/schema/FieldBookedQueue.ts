import { Schema, Types, model } from "mongoose"
import { SCHEMA } from "./schema-name"
import IFieldBookedQueue from "../interface/IFieldBookedQueue"

const FieldBookedQueueSchema = new Schema<IFieldBookedQueue>({
  booked_by: {
    type: Schema.Types.ObjectId,
    ref: SCHEMA.USERS
  },
  field_id: {
    type: Schema.Types.ObjectId,
    ref: SCHEMA.FIELDS
  },
  booked_time: {
    type: Date
  },
  time_count: {
    type: Number
  },
  status: {
    type: String
  }
})

export default model<IFieldBookedQueue>(SCHEMA.FIELD_BOOKED_QUEUES, FieldBookedQueueSchema)
