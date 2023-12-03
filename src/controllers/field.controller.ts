import { Types } from "mongoose"
import { EFieldStatus } from "../enum"
import { CustomError, HttpStatusCode } from "../helper"
import { IField } from "../interface"
import { FieldModel } from "../models"
import BaseController from "./base.controller"
import BranchController from "./branch.controller"

class FieldController extends BaseController {
  constructor() {
    super()
  }

  static async validate(id: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const field = await FieldModel.findById(id)
      if (!field) return Promise.reject(new CustomError("Sân bóng không tồn tại", HttpStatusCode.BAD_REQUEST))
      return field
    })
  }

  static async getAll() {
    return await super.handleResponse(async () => {
      const fields = await FieldModel.find()
      return fields
    })
  }

  static async getById(id: string | Types.ObjectId) {
    return this.validate(id)
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
