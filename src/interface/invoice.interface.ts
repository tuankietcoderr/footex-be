import { Types } from "mongoose"
import { EInvoiceStatus } from "../enum"
import IFieldBookedQueue from "./owner/field-booked-queue.interface"

export default interface IInvoice {
  total: number
  status: EInvoiceStatus
  fieldBooked: Types.ObjectId | string | IFieldBookedQueue
}
