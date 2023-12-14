import { Types } from "mongoose"
import BaseController from "./base.controller"
import { RateModel } from "../models"
import { CustomError, HttpStatusCode } from "../helper"
import { ERate } from "../enum"
import { IRate } from "../interface"
import FieldController from "./field.controller"
import BranchController from "./branch.controller"
import TeamController from "./team.controller"

class RateController extends BaseController {
  constructor() {
    super()
  }

  static async validate(id: string | Types.ObjectId) {
    return super.handleResponse(async () => {
      const rate = await RateModel.findById(id)
      if (!rate) return Promise.reject(new CustomError("Rate không tồn tại", HttpStatusCode.BAD_REQUEST))
      return rate
    })
  }

  static async getObjectRates(objectType: ERate, objectId: string | Types.ObjectId) {
    return super.handleResponse(async () => {
      const rates = await RateModel.find(
        { refPath: objectType, object: objectId },
        {},
        {
          populate: {
            path: "valuer",
            select: "name avatar"
          }
        }
      )
      return rates
    })
  }

  static async create(body: IRate) {
    return super.handleResponse(async () => {
      const { refPath, object } = body
      switch (refPath) {
        case ERate.FIELD:
          await FieldController.validate(object as string)
          break
        case ERate.BRANCH:
          await BranchController.validate(object as string)
          break
        case ERate.TEAM:
          await TeamController.validate(object as string)
          break
        default:
          return Promise.reject(new CustomError("RefPath không hợp lệ", HttpStatusCode.BAD_REQUEST))
      }
      const newRate = await RateModel.create(body)
      return await newRate.populate("valuer", "name avatar")
    })
  }
}

export default RateController
