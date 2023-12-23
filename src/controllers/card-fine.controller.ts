import { CustomError, HttpStatusCode } from "../helper"
import { ICardFine } from "../interface"
import { CardFineModel } from "../models"
import BaseController from "./base.controller"

class CardFineController extends BaseController {
  constructor() {
    super()
  }

  static async create(body: ICardFine) {
    return await super.handleResponse(async () => {
      const cardFine = await CardFineModel.create(body)
      if (!cardFine) {
        return Promise.reject(new CustomError("Thẻ phạt chưa được tạo thành công!", HttpStatusCode.BAD_REQUEST))
      }
      return cardFine
    })
  }
}

export default CardFineController
