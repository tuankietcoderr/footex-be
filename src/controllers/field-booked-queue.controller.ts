import { Types } from "mongoose"
import { CustomError, HttpStatusCode } from "../helper"
import { IBranch, IFieldBookedQueue, IGuest, IOwner } from "../interface"
import { FieldBookedQueueModel, FieldModel, GuestModel } from "../models"
import BaseController from "./base.controller"
import FieldController from "./field.controller"
import { EFieldStatus } from "../enum"
import MailController from "./mail.controller"

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
      const { field, startAt, endAt, bookedBy } = body
      const guest = await GuestModel.findById(bookedBy)
      if (!guest) return Promise.reject(new CustomError("Khách hàng không tồn tại", HttpStatusCode.BAD_REQUEST))
      if (startAt > endAt) {
        return Promise.reject(
          new CustomError("Ngày bắt đầu không được lớn hơn ngày kết thúc", HttpStatusCode.BAD_REQUEST)
        )
      }
      if (new Date(startAt) < new Date()) {
        return Promise.reject(
          new CustomError("Ngày bắt đầu không được nhỏ hơn ngày hiện tại", HttpStatusCode.BAD_REQUEST)
        )
      }
      const { data: _field } = await FieldController.validate(field as string)
      if (_field.status === EFieldStatus.DELETED || _field.status === EFieldStatus.MAINTAINING) {
        return Promise.reject(new CustomError("Sân hiện tại không thể đặt được", HttpStatusCode.BAD_REQUEST))
      }
      const populate = await _field.populate({
        path: "branch",
        populate: {
          path: "owner"
        }
      })
      const branch = populate.branch as IBranch
      const owner = branch.owner as IOwner

      const startAtTime = new Date(startAt).getHours()
      const endAtTime = new Date(endAt).getHours()
      if (startAtTime < branch.openAt || endAtTime > branch.closeAt) {
        return Promise.reject(
          new CustomError(
            `Thời gian đặt sân không hợp lệ. Chi nhánh chỉ hoạt động từ ${branch.openAt}h đến ${branch.closeAt}h`,
            HttpStatusCode.BAD_REQUEST
          )
        )
      }

      //! Check if field is booked - WRONG CONDITION
      const existingFieldBookedQueue = await FieldBookedQueueModel.find({
        field,
        $or: [
          {
            startAt: { $gte: startAt, $lt: endAt }
          },
          {
            endAt: { $gt: startAt, $lte: endAt }
          },
          {
            startAt: { $lte: startAt },
            endAt: { $gte: endAt }
          }
        ]
      })
      if (existingFieldBookedQueue.length > 0) {
        return Promise.reject(new CustomError("Sân đã được đặt trong khoảng thời gian này", HttpStatusCode.BAD_REQUEST))
      }

      const fieldBookedQueue = await FieldBookedQueueModel.create(body)
      const populatedFieldBookedQueue = await fieldBookedQueue.populate("bookedBy")
      MailController.sendBookedEmail(guest.email)
      MailController.sendOwnerBookedEmail(owner.email, _field.name, branch.name)
      return populatedFieldBookedQueue
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
      const fieldBookedQueue = await FieldBookedQueueModel.find({ field: id }, undefined, {
        populate: [
          {
            path: "bookedBy",
            select: "avatar name phoneNumber email"
          },
          {
            path: "field",
            select: "price"
          }
        ]
      })
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
