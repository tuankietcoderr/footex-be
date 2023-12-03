import { Types } from "mongoose"
import BaseController from "./base.controller"
import { PrizeModel } from "../models"
import { CustomError, HttpStatusCode } from "../helper"
import { IPrize } from "../interface"
import BranchController from "./branch.controller"

class PrizeController extends BaseController {
  constructor() {
    super()
  }

  static async validate(id: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const owner = await PrizeModel.findById(id)
      if (!owner) return Promise.reject(new CustomError("Prize không tồn tại", HttpStatusCode.BAD_REQUEST))
      return owner
    })
  }

  static async getById(id: string | Types.ObjectId) {
    return await this.validate(id)
  }

  static async create(data: IPrize) {
    return await super.handleResponse(async () => {
      const { branch } = data
      if (!branch) return Promise.reject(new CustomError("Branch không tồn tại", HttpStatusCode.BAD_REQUEST))
      const _branch = await BranchController.getBranchById(branch as string)
      if (!_branch) return Promise.reject(new CustomError("Branch không tồn tại", HttpStatusCode.BAD_REQUEST))
      const prize = await PrizeModel.create(data)
      return prize
    })
  }

  static async update(id: string | Types.ObjectId, data: IPrize) {
    return await super.handleResponse(async () => {
      const { branch } = data
      if (!branch) return Promise.reject(new CustomError("Branch không tồn tại", HttpStatusCode.BAD_REQUEST))
      const _branch = await BranchController.getBranchById(branch as string)
      if (!_branch) return Promise.reject(new CustomError("Branch không tồn tại", HttpStatusCode.BAD_REQUEST))
      const prize = await PrizeModel.findByIdAndUpdate(id, { $set: data }, { new: true })
      return prize
    })
  }

  static async delete(id: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const prize = await PrizeModel.findByIdAndDelete(id)
      return prize
    })
  }

  static async getBranchPrizes(branch: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const prizes = await PrizeModel.find({ branch })
      return prizes
    })
  }

  static async getAll() {
    return await super.handleResponse(async () => {
      const prizes = await PrizeModel.find()
      return prizes
    })
  }
}

export default PrizeController
