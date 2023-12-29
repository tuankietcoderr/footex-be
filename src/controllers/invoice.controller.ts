import { Types } from "mongoose"
import { IInvoice } from "../interface"
import { InvoiceModel } from "../models"
import BaseController from "./base.controller"
import { CustomError, HttpStatusCode } from "../helper"
import { SCHEMA } from "../models/schema-name"

class InvoiceController extends BaseController {
  constructor() {
    super()
  }

  static async validate(id: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const invoice = await InvoiceModel.findById(id)
      if (!invoice) return Promise.reject(new CustomError("Invoice không tồn tại", HttpStatusCode.BAD_REQUEST))
      return invoice
    })
  }

  static async getAll() {
    return await super.handleResponse(async () => {
      const invoices = await InvoiceModel.find({})
      return invoices
    })
  }

  static async getBranchInvoices(branchId: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const invoices = await InvoiceModel.aggregate([
        {
          $lookup: {
            from: SCHEMA.FIELD_BOOKED_QUEUES,
            localField: "fieldBooked",
            foreignField: "_id",
            as: "fieldBooked",
            pipeline: [
              {
                $project: {
                  field: 1,
                  bookedBy: 1,
                  startAt: 1,
                  endAt: 1
                }
              }
            ]
          }
        },
        { $unwind: "$fieldBooked" },
        {
          $lookup: {
            from: SCHEMA.FIELDS,
            localField: "fieldBooked.field",
            foreignField: "_id",
            as: "fieldBooked.field",
            pipeline: [
              {
                $project: {
                  name: 1,
                  price: 1,
                  type: 1,
                  branch: 1,
                  image: 1
                }
              }
            ]
          }
        },
        { $unwind: "$fieldBooked.field" },
        {
          $lookup: {
            from: SCHEMA.BRANCHES,
            localField: "fieldBooked.field.branch",
            foreignField: "_id",
            as: "branch"
          }
        },
        { $unwind: "$branch" },
        {
          $lookup: {
            from: SCHEMA.GUESTS,
            localField: "fieldBooked.bookedBy",
            foreignField: "_id",
            as: "fieldBooked.bookedBy"
          }
        },
        { $unwind: "$fieldBooked.bookedBy" },
        {
          $match: {
            "branch._id": new Types.ObjectId(branchId)
          }
        },
        {
          $project: {
            _id: 1,
            fieldBooked: 1,
            createdAt: 1,
            updatedAt: 1,
            total: 1,
            status: 1
          }
        }
      ])
      return invoices
    })
  }

  static async getById(id: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const invoice = await InvoiceModel.findById(id)
      return invoice
    })
  }

  static async create(body: IInvoice) {
    return await super.handleResponse(async () => {
      const newInvoice = await InvoiceModel.create(body)
      return newInvoice
    })
  }

  static async update(id: string | Types.ObjectId, body: IInvoice) {
    return await super.handleResponse(async () => {
      const updatedInvoice = await InvoiceModel.findByIdAndUpdate(id, { $set: body }, { new: true })
      if (!updatedInvoice) return Promise.reject(new CustomError("Invoice không tồn tại", HttpStatusCode.BAD_REQUEST))
      return updatedInvoice
    })
  }

  static async delete(id: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const { data: invoice } = await this.validate(id)
      await invoice.deleteOne()
      return invoice
    })
  }
}

export default InvoiceController
