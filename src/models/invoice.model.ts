import { PaginateModel, Schema, model } from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"
import { EInvoiceStatus } from "../enum"
import { IInvoice } from "../interface"
import { SCHEMA } from "./schema-name"

const InvoiceModel = new Schema<IInvoice>(
  {
    fieldBooked: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA.FIELD_BOOKED_QUEUES
    },
    status: {
      type: String,
      enum: Object.values(EInvoiceStatus),
      default: EInvoiceStatus.PENDING
    },
    total: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

InvoiceModel.plugin(mongoosePaginate)

export default model<IInvoice, PaginateModel<IInvoice>>(SCHEMA.INVOICES, InvoiceModel, SCHEMA.INVOICES)
