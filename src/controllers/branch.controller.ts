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
  static async getAllBranches() {
    return await super.handleResponse(async () => {
      const branches = await BranchModel.find()
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
