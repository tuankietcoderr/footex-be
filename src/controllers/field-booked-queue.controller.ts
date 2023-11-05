import { Types } from "mongoose"
import { CustomError, HttpStatusCode } from "../helper"
import { IFieldBookedQueue } from "../interface"
import { FieldBookedQueueModel, FieldModel } from "../models"
import BaseController from "./base.controller"
import FieldController from "./field.controller"

class FieldBookedQueueController extends BaseController {
  constructor() {
    super()
  }

  static async validateFieldBookedQueue(id: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const fieldBookedQueue = await FieldBookedQueueModel.findById(id)
      if (!fieldBookedQueue)
        return Promise.reject(new CustomError("FieldBookedQueue không tồn tại", HttpStatusCode.BAD_REQUEST))
      return fieldBookedQueue
    })
  }

  static async create(body: IFieldBookedQueue) {
    return await super.handleResponse(async () => {
      const { field } = body
      await FieldController.validateField(field as string)
      const fieldBookedQueue = await FieldBookedQueueModel.create(body)
      return fieldBookedQueue
    })
  }

  static async updateFieldBookedQueueInfo(id: string | Types.ObjectId, body: IFieldBookedQueue) {
    return await super.handleResponse(async () => {
      const fieldBookedQueue = await FieldBookedQueueModel.findByIdAndUpdate(id, { $set: body }, { new: true })
      if (!fieldBookedQueue)
        return Promise.reject(new CustomError("FieldBookedQueue không tồn tại", HttpStatusCode.BAD_REQUEST))
      return fieldBookedQueue
    })
  }

  static async updateFieldBookedQueueStatus(id: string | Types.ObjectId, status: string) {
    return await super.handleResponse(async () => {
      const fieldBookedQueue = await FieldBookedQueueModel.findByIdAndUpdate(
        id,
        { $set: { status } },
        { new: true, runValidators: true }
      )
      if (!fieldBookedQueue)
        return Promise.reject(new CustomError("FieldBookedQueue không tồn tại", HttpStatusCode.BAD_REQUEST))
      return fieldBookedQueue
    })
  }

  static async getUserFieldBookedQueue(id: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const fieldBookedQueue = await FieldBookedQueueModel.find({ bookedBy: id })
      return fieldBookedQueue
    })
  }

  static async getFieldBookedQueueById(id: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const fieldBookedQueue = await FieldBookedQueueModel.findById(id)
      if (!fieldBookedQueue)
        return Promise.reject(new CustomError("FieldBookedQueue không tồn tại", HttpStatusCode.BAD_REQUEST))
      return fieldBookedQueue
    })
  }

  static async getFieldBookedQueueByFieldId(id: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      await FieldController.validateField(id)
      const fieldBookedQueue = await FieldBookedQueueModel.find({ field: id })
      return fieldBookedQueue
    })
  }

  static async deleteFieldBookedQueue(id: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const fieldBookedQueue = await FieldBookedQueueModel.findByIdAndDelete(id)
      if (!fieldBookedQueue)
        return Promise.reject(new CustomError("FieldBookedQueue không tồn tại", HttpStatusCode.BAD_REQUEST))
      return fieldBookedQueue
    })
  }
}

export default FieldBookedQueueController
