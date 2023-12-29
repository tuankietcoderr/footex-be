import { Types } from "mongoose"
import { EFieldBookedQueueStatus, EFieldStatus } from "../enum"
import { CustomError, HttpStatusCode } from "../helper"
import { IAddress, IField, IGuest } from "../interface"
import { BranchModel, FieldBookedQueueModel, FieldModel } from "../models"
import BaseController from "./base.controller"
import BranchController from "./branch.controller"
import { SCHEMA } from "../models/schema-name"
import fieldBookedQueueModel from "../models/field-booked-queue.model"
import MailController from "./mail.controller"

class FieldController extends BaseController {
  constructor() {
    super()
  }

  static async validate(id: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const field = await FieldModel.findById(
        id,
        {},
        {
          populate: {
            path: "branch",
            select: "-description -openAt -closeAt -owner -street -houseNumber -createdAt -updatedAt"
          }
        }
      )
      if (!field) return Promise.reject(new CustomError("Sân bóng không tồn tại", HttpStatusCode.BAD_REQUEST))
      return field
    })
  }

  static async normalGetAll() {
    return await super.handleResponse(async () => {
      const fields = await FieldModel.find(
        {},
        {
          name: 1,
          price: 1,
          image: 1,
          status: 1,
          type: 1,
          branch: 1
        },
        {
          populate: {
            path: "branch",
            select: "-description"
          }
        }
      )
      return fields
    })
  }

  static async getAll(queries?: any) {
    return await super.handleResponse(async () => {
      const { city, district, ward, status, type, price, keyword } = queries
      const queryKeys = Object.keys(queries)
      const keywordKeyIndex = queryKeys.indexOf("keyword")
      if (keywordKeyIndex !== -1) queryKeys.splice(keywordKeyIndex, 1)
      const priceArr = price?.split(",") ?? [0, 0]
      const minPrice = parseInt(priceArr[0])
      const maxPrice = parseInt(priceArr[1])
      const _type = parseInt(type)

      let fields = []

      if (keyword) {
        fields = await FieldModel.find(
          {
            name: { $regex: keyword, $options: "i" }
          },
          {
            name: 1,
            price: 1,
            image: 1,
            status: 1,
            type: 1,
            branch: 1,
            saves: 1
          },
          {
            populate: {
              path: "branch",
              select: "-description"
            }
          }
        )
      } else {
        fields = await FieldModel.aggregate([
          {
            $lookup: {
              from: SCHEMA.BRANCHES,
              localField: "branch",
              foreignField: "_id",
              as: "branch",
              pipeline: [
                {
                  $project: {
                    ward: 1,
                    district: 1,
                    city: 1,
                    houseNumber: 1,
                    street: 1
                  }
                }
              ]
            }
          },
          {
            $unwind: "$branch"
          },
          {
            $match:
              queryKeys.length > 0
                ? {
                    $and: [
                      {
                        ...(city && {
                          "branch.city": { $eq: city }
                        })
                      },
                      {
                        ...(district && { "branch.district": { $eq: district } })
                      },
                      {
                        ...(ward && { "branch.ward": { $eq: ward } })
                      },
                      {
                        ...(status !== "all" && { status })
                      },
                      {
                        ...(type && type !== "0" && { type: _type })
                      },
                      {
                        ...(maxPrice !== 0 && { price: { $gte: minPrice, $lte: maxPrice } })
                      }
                    ]
                  }
                : {}
          },
          {
            //! TODO: project
            $project: {
              name: 1,
              price: 1,
              image: 1,
              status: 1,
              type: 1,
              branch: 1,
              saves: 1
            }
          }
        ])
      }
      return fields
    })
  }

  static async getById(id: string | Types.ObjectId) {
    return this.validate(id)
  }

  static async getFieldsNearBranchAddress(branchId: string | Types.ObjectId, address: IAddress) {
    return await super.handleResponse(async () => {
      const { city, district, ward } = address
      await BranchController.validate(branchId)
      const fields = await FieldModel.aggregate([
        {
          $lookup: {
            from: SCHEMA.BRANCHES,
            localField: "branch",
            foreignField: "_id",
            as: "branch",
            pipeline: [
              {
                $project: {
                  city: 1,
                  district: 1,
                  ward: 1,
                  street: 1,
                  houseNumber: 1
                }
              }
            ]
          }
        },
        {
          $unwind: "$branch"
        },
        {
          $match: {
            $and: [
              {
                "branch.city": { $eq: city }
              },
              {
                "branch.district": { $eq: district }
              },
              {
                "branch.ward": { $eq: ward }
              }
            ]
          }
        },
        {
          $project: {
            branch: 1,
            name: 1,
            price: 1,
            image: 1,
            status: 1,
            type: 1
          }
        }
      ])
      return fields
    })
  }

  static async getBranchsField(id: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      await BranchController.validate(id)
      const fields = await FieldModel.find(
        { branch: id },
        {
          name: 1,
          price: 1,
          image: 1,
          status: 1,
          type: 1,
          branch: 1,
          description: 1
        },
        {
          populate: {
            path: "branch",
            select: "ward district city street houseNumber"
          }
        }
      )
      return fields
    })
  }

  static async create(body: IField) {
    return await super.handleResponse(async () => {
      const field = await FieldModel.create(body)
      return field
    })
  }

  static async updateInfo(id: string | Types.ObjectId, body: IField) {
    return await super.handleResponse(async () => {
      const field = await FieldModel.findByIdAndUpdate(id, { $set: body }, { new: true })
      if (!field) return Promise.reject(new CustomError("Sân bóng không tồn tại", HttpStatusCode.BAD_REQUEST))
      return field
    })
  }

  static async updateStatus(id: string | Types.ObjectId, status: EFieldStatus) {
    return await super.handleResponse(async () => {
      const field = await FieldModel.findByIdAndUpdate(id, { $set: { status } }, { new: true, runValidators: true })
      if (!field) return Promise.reject(new CustomError("Sân bóng không tồn tại", HttpStatusCode.BAD_REQUEST))
      if (status === EFieldStatus.MAINTAINING || status === EFieldStatus.DELETED) {
        const bookedQueues = await FieldBookedQueueModel.find(
          { field: id, status: EFieldBookedQueueStatus.PENDING },
          {},
          {
            populate: {
              path: "bookedBy"
            }
          }
        )
        if (bookedQueues) {
          for (const bookedQueue of bookedQueues) {
            const bookedBy = bookedQueue.bookedBy as IGuest
            MailController.sendObjectStatusEmail(bookedBy.email, field.name, status)
          }
        }
      }
      return field
    })
  }

  static async saveField(id: string | Types.ObjectId, userId: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const field = await FieldModel.findById(id)
      if (!field) return Promise.reject(new CustomError("Sân bóng không tồn tại", HttpStatusCode.BAD_REQUEST))
      const isSaved = field.saves.map((s) => s.toString()).includes(userId.toString())
      if (isSaved) {
        await FieldModel.findByIdAndUpdate(id, { $pull: { saves: userId } })
        return false
      } else {
        await FieldModel.findByIdAndUpdate(id, { $push: { saves: userId } })
        return true
      }
    })
  }

  static async getSavedFields(userId: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const fields = await FieldModel.find(
        { saves: { $elemMatch: { $eq: userId } } },
        {
          name: 1,
          price: 1,
          image: 1,
          status: 1,
          type: 1,
          branch: 1,
          saves: 1
        },
        {
          populate: {
            path: "branch",
            select: "-description"
          }
        }
      )
      return fields
    })
  }

  static async getBookedFields(userId: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const fields = await FieldModel.aggregate([
        {
          $lookup: {
            from: SCHEMA.FIELD_BOOKED_QUEUES,
            localField: "_id",
            foreignField: "field",
            as: "fieldBookedQueue"
          }
        },
        {
          $match: {
            "fieldBookedQueue.bookedBy": new Types.ObjectId(userId)
          }
        },
        {
          $lookup: {
            from: SCHEMA.BRANCHES,
            localField: "branch",
            foreignField: "_id",
            as: "branch",
            pipeline: [
              {
                $project: {
                  ward: 1,
                  district: 1,
                  city: 1,
                  houseNumber: 1,
                  street: 1
                }
              }
            ]
          }
        },
        { $unwind: "$branch" },
        {
          $project: {
            name: 1,
            price: 1,
            image: 1,
            status: 1,
            type: 1,
            branch: 1,
            saves: 1
          }
        }
      ])
      return fields
    })
  }
}

export default FieldController
