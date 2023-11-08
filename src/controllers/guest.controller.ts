import { Types } from "mongoose"
import { CredentialModel, GuestModel } from "../models"
import { IGuest, ITeam } from "../interface"
import TeamController from "./team.controller"
import BaseController from "./base.controller"
import MailController from "./mail.controller"
import CredentialController from "./credential.controller"
import { CustomError, HttpStatusCode } from "../helper"
import { EGuestStatus, ERole } from "../enum"

class GuestController extends BaseController {
  constructor() {
    super()
  }

  static async signUp(body: IGuest) {
    return await super.handleResponse(async () => {
      const { email, phoneNumber, password } = body
      const guest = await GuestModel.findOne({ $or: [{ email }, { phoneNumber }] })
      if (guest)
        return Promise.reject(new CustomError("Email hoặc số điện thoại đã tồn tại", HttpStatusCode.BAD_REQUEST))

      const newGuest = new GuestModel(body)
      const bcryptPassword = await CredentialController.hash(password)
      const newCredential = new CredentialModel({
        userId: newGuest._id,
        password: bcryptPassword
      })
      await newCredential.save()
      await newGuest.save()
      const accessToken = CredentialController.JWTSign({ role: ERole.GUEST, userId: newGuest._id.toString() })

      return { newGuest, accessToken }
    })
  }

  static async signIn({ emailOrPhoneNumber, password }: { emailOrPhoneNumber: string; password: string }) {
    return await super.handleResponse(async () => {
      const guest = await GuestModel.findOne({
        $or: [{ email: emailOrPhoneNumber }, { phoneNumber: emailOrPhoneNumber }]
      })
      if (!guest)
        return Promise.reject(new CustomError("Email hoặc số điện thoại không tồn tại", HttpStatusCode.BAD_REQUEST))

      const credential = await CredentialController.getCredential(guest._id)
      const isMatch = await CredentialController.compare(password, credential.password)
      if (!isMatch) return Promise.reject(new CustomError("Mật khẩu không đúng", HttpStatusCode.BAD_REQUEST))
      const accessToken = CredentialController.JWTSign({ role: ERole.GUEST, userId: guest._id.toString() })
      return { guest, accessToken }
    })
  }

  static async validate(id: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const guest = await GuestModel.findById(id)
      if (!guest) return Promise.reject(new CustomError("Guest không tồn tại", HttpStatusCode.BAD_REQUEST))
      return guest
    })
  }

  static async create(guest: IGuest) {
    return await super.handleResponse(async () => {
      const { email, phoneNumber } = guest
      const guestExist = await GuestModel.findOne({ $or: [{ email }, { phoneNumber }] })
      if (guestExist)
        return Promise.reject(new CustomError("Email hoặc số điện thoại đã tồn tại", HttpStatusCode.BAD_REQUEST))
      const newGuest = await GuestModel.create(guest)
      return newGuest
    })
  }

  static async getById(id: string | Types.ObjectId) {
    return await this.validate(id)
  }

  static async updateInfo(id: string | Types.ObjectId, body: IGuest) {
    return await super.handleResponse(async () => {
      const guest = await GuestModel.findByIdAndUpdate(id, { $set: body }, { new: true })
      if (!guest) return Promise.reject(new CustomError("Guest không tồn tại", HttpStatusCode.BAD_REQUEST))
      return guest
    })
  }

  static async sendVerifyEmail(email: string) {
    return await super.handleResponse(async () => {
      const guest = await GuestModel.findOne({ email })
      if (!guest) return Promise.reject(new CustomError("Email không tồn tại", HttpStatusCode.BAD_REQUEST))
      const {
        data: { isSent }
      } = await MailController.sendVerifyEmail(email, "guest/verify-email")
      if (!isSent) return Promise.reject(new CustomError("Gửi email xác thực thất bại", HttpStatusCode.BAD_REQUEST))
      return isSent
    })
  }

  static async verifyEmail({ email, token }: { email: string; token: string }) {
    return await super.handleResponse(async () => {
      const isMatch = await MailController.verifyEmail({ email, token })
      if (!isMatch) return Promise.reject(new CustomError("Token không hợp lệ", HttpStatusCode.BAD_REQUEST))
      const verifiedGuest = await GuestModel.updateOne({ email }, { $set: { isEmailVerified: true } })
      if (!verifiedGuest) return Promise.reject(new CustomError("Email không hợp lệ", HttpStatusCode.BAD_REQUEST))
      return isMatch
    })
  }

  static async forgotPassword(email: string) {
    return await super.handleResponse(async () => {
      const guest = await GuestModel.findOne({ email })
      if (!guest) return Promise.reject(new CustomError("Email không tồn tại", HttpStatusCode.BAD_REQUEST))
      if (!guest.isEmailVerified) {
        return Promise.reject(new CustomError("Email chưa được xác thực", HttpStatusCode.BAD_REQUEST))
      }
      const {
        data: { hashedPassword }
      } = await MailController.sendForgotPasswordEmail(email)
      await CredentialController.getCredential(guest._id)
      await CredentialController.updateCredential(guest._id, hashedPassword)
    })
  }

  static async updateStatus(_id: string | Types.ObjectId, status: EGuestStatus) {
    return await super.handleResponse(async () => {
      return await GuestModel.updateOne({ _id }, { $set: { status } })
    })
  }
}

export default GuestController
