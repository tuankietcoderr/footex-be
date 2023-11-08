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

  static async validate(id: string | Types.ObjectId) {
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
      await FieldController.validate(field as string)
      const fieldBookedQueue = await FieldBookedQueueModel.create(body)
      return fieldBookedQueue
    })
  }

  static async updateInfo(id: string | Types.ObjectId, body: IFieldBookedQueue) {
    return await super.handleResponse(async () => {
      const fieldBookedQueue = await FieldBookedQueueModel.findByIdAndUpdate(id, { $set: body }, { new: true })
      if (!fieldBookedQueue)
        return Promise.reject(new CustomError("FieldBookedQueue không tồn tại", HttpStatusCode.BAD_REQUEST))
      return fieldBookedQueue
    })
  }

  static async updateStatus(id: string | Types.ObjectId, status: string) {
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

  static async getGuestFieldBookedQueue(id: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const fieldBookedQueue = await FieldBookedQueueModel.find({ bookedBy: id })
      return fieldBookedQueue
    })
  }

  static async getById(id: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const fieldBookedQueue = await FieldBookedQueueModel.findById(id)
      if (!fieldBookedQueue)
        return Promise.reject(new CustomError("FieldBookedQueue không tồn tại", HttpStatusCode.BAD_REQUEST))
      return fieldBookedQueue
    })
  }

  static async getByFieldId(id: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      await FieldController.validate(id)
      const fieldBookedQueue = await FieldBookedQueueModel.find({ field: id })
      return fieldBookedQueue
    })
  }

  static async delete(id: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const fieldBookedQueue = await FieldBookedQueueModel.findByIdAndDelete(id)
      if (!fieldBookedQueue)
        return Promise.reject(new CustomError("FieldBookedQueue không tồn tại", HttpStatusCode.BAD_REQUEST))
      return fieldBookedQueue
    })
  }
}

export default FieldBookedQueueController
