import { Types } from "mongoose"
import { EFieldStatus } from "../enum"
import { CustomError, HttpStatusCode } from "../helper"
import { IAddress, IField } from "../interface"
import { BranchModel, FieldModel } from "../models"
import BaseController from "./base.controller"
import BranchController from "./branch.controller"
import { SCHEMA } from "../models/schema-name"

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
            type: 1
          }
        )
      } else {
        fields = await FieldModel.aggregate([
          {
            $lookup: {
              from: SCHEMA.BRANCHES,
              localField: "branch",
              foreignField: "_id",
              as: "branch"
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
              branch: "$branch._id",
              name: 1,
              price: 1,
              image: 1,
              status: 1,
              type: 1
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
            branch: "$branch._id",
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
      const fields = await FieldModel.find({ branch: id })
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
      return field
    })
  }
}

export default FieldController
