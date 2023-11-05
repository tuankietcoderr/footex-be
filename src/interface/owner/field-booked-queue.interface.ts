import { Types } from "mongoose"
import { EFieldBookedQueueStatus } from "../../enum"
import IField from "./field.interface"
import IGuest from "../guest/guest.interface"

export default interface IFieldBookedQueue {
  bookedAt: Date
  bookedBy: string | Types.ObjectId | IGuest
  usageTimeCount: number
  status: EFieldBookedQueueStatus
  field: Types.ObjectId | string | IField
}
