import { Types } from "mongoose"
import { EBranchStatus } from "../enum"
import { CustomError, HttpStatusCode } from "../helper"
import { IBranch } from "../interface"
import { BranchModel } from "../models"

class BranchController {
  static async getAllBranches() {
    try {
      const branches = await BranchModel.find()
      return Promise.resolve({ data: branches })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  static async getBranchById(id: string | Types.ObjectId) {
    try {
      const branch = await BranchModel.findById(id)
      if (!branch) return Promise.reject(new CustomError("Chi nhánh không tồn tại", HttpStatusCode.BAD_REQUEST))
      return Promise.resolve({ data: branch })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  static async create(body: IBranch) {
    try {
      const branch = await BranchModel.create(body)
      return Promise.resolve({ data: branch })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  static async updateInfo(id: string | Types.ObjectId, body: IBranch) {
    try {
      const branch = await BranchModel.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true })
      if (!branch) return Promise.reject(new CustomError("Chi nhánh không tồn tại", HttpStatusCode.BAD_REQUEST))
      return Promise.resolve({ data: branch })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  static async updateStatus(id: string | Types.ObjectId, status: EBranchStatus) {
    try {
      const branch = await BranchModel.findByIdAndUpdate(id, { $set: { status } }, { new: true, runValidators: true })
      if (!branch) return Promise.reject(new CustomError("Chi nhánh không tồn tại", HttpStatusCode.BAD_REQUEST))
      return Promise.resolve({ data: branch })
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export default BranchController
