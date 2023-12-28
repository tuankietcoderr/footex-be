import { Types } from "mongoose"
import { EBranchStatus } from "../enum"
import { CustomError, HttpStatusCode } from "../helper"
import { IBranch } from "../interface"
import { BranchModel } from "../models"
import BaseController from "./base.controller"

class BranchController extends BaseController {
  constructor() {
    super()
  }

  static async normalGetAll() {
    return await super.handleResponse(async () => {
      const branches = await BranchModel.find(
        {},
        { description: 0 },
        {
          populate: {
            path: "owner",
            select: "name email phoneNumber"
          }
        }
      )
      return branches
    })
  }

  static async getAllBranches(queries?: any) {
    return await super.handleResponse(async () => {
      const { city, district, ward, keyword } = queries
      const queryKeys = Object.keys(queries)
      const keywordKeyIndex = queryKeys.indexOf("keyword")
      if (keywordKeyIndex !== -1) queryKeys.splice(keywordKeyIndex, 1)

      let branches = []

      if (keyword) {
        branches = await BranchModel.find(
          {
            $or: [{ name: { $regex: keyword, $options: "i" } }, { phoneNumber: { $regex: keyword, $options: "i" } }]
          },
          {
            description: 0,
            owner: 0,
            images: 0,
            createdAt: 0,
            updatedAt: 0
          }
        )
      } else {
        branches = await BranchModel.find(
          queryKeys.length > 0
            ? {
                $and: [
                  { status: EBranchStatus.ACTIVE },
                  { ...(city && { city: { $eq: city } }) },
                  { ...(district && { district: { $eq: district } }) },
                  { ...(ward && { ward: { $eq: ward } }) }
                ]
              }
            : {},
          {
            description: 0,
            owner: 0,
            images: 0,
            createdAt: 0,
            updatedAt: 0
          }
        )
      }
      return branches
    })
  }

  static async validate(id: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const branch = await BranchModel.findById(id)
      if (!branch) return Promise.reject(new CustomError("Chi nhánh không tồn tại", HttpStatusCode.BAD_REQUEST))
      return branch
    })
  }

  static async getBranchById(id: string | Types.ObjectId) {
    return await this.validate(id)
  }

  static async getOwnerBranches(ownerId: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const branches = await BranchModel.find({ owner: ownerId })
      return branches
    })
  }

  static async create(body: IBranch) {
    return await super.handleResponse(async () => {
      const newBranch = await BranchModel.create(body)
      return newBranch
    })
  }

  static async updateInfo(id: string | Types.ObjectId, body: IBranch) {
    return await super.handleResponse(async () => {
      const branch = await BranchModel.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true })
      if (!branch) return Promise.reject(new CustomError("Chi nhánh không tồn tại", HttpStatusCode.BAD_REQUEST))
      return branch
    })
  }

  static async updateStatus(id: string | Types.ObjectId, status: EBranchStatus) {
    return await super.handleResponse(async () => {
      const branch = await BranchModel.findByIdAndUpdate(id, { $set: { status } }, { new: true, runValidators: true })
      if (!branch) return Promise.reject(new CustomError("Chi nhánh không tồn tại", HttpStatusCode.BAD_REQUEST))
      return branch
    })
  }

  static async delete(id: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const branch = await BranchModel.findByIdAndDelete(id)
      if (!branch) return Promise.reject(new CustomError("Chi nhánh không tồn tại", HttpStatusCode.BAD_REQUEST))
      return branch
    })
  }
}

export default BranchController
