import { Types } from "mongoose"
import { EOwnerStatus, ERole } from "../enum"
import { CredentialModel, OwnerModel } from "../models"
import BaseController from "./base.controller"
import { IGuest, IOwner } from "../interface"
import CredentialController from "./credential.controller"
import MailController from "./mail.controller"
import { CustomError, HttpStatusCode } from "../helper"

class OwnerController extends BaseController {
  constructor() {
    super()
  }

  static async validate(id: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const owner = await OwnerModel.findById(id)
      if (!owner) return Promise.reject(new CustomError("Owner không tồn tại", HttpStatusCode.BAD_REQUEST))
      return owner
    })
  }

  static async signUp(body: IOwner) {
    return await super.handleResponse(async () => {
      const { email, phoneNumber, password } = body
      const owner = await OwnerModel.findOne({ $or: [{ email }, { phoneNumber }] })
      if (owner)
        return Promise.reject(new CustomError("Email hoặc số điện thoại đã tồn tại", HttpStatusCode.BAD_REQUEST))

      const newOwner = new OwnerModel(body)
      const bcryptPassword = await CredentialController.hash(password)
      const newCredential = new CredentialModel({
        userId: newOwner._id,
        password: bcryptPassword
      })
      await newCredential.save()
      await newOwner.save()
      const accessToken = CredentialController.JWTSign({ role: ERole.OWNER, userId: newOwner._id.toString() })

      return { newOwner, accessToken }
    })
  }

  static async signIn({ emailOrPhoneNumber, password }: { emailOrPhoneNumber: string; password: string }) {
    return await super.handleResponse(async () => {
      const owner = await OwnerModel.findOne({
        $or: [{ email: emailOrPhoneNumber }, { phoneNumber: emailOrPhoneNumber }]
      })
      if (!owner)
        return Promise.reject(new CustomError("Email hoặc số điện thoại không tồn tại", HttpStatusCode.BAD_REQUEST))

      const credential = await CredentialController.getCredential(owner._id)
      const isMatch = await CredentialController.compare(password, credential.password)
      if (!isMatch) return Promise.reject(new CustomError("Mật khẩu không đúng", HttpStatusCode.BAD_REQUEST))
      const accessToken = CredentialController.JWTSign({ role: ERole.OWNER, userId: owner._id.toString() })
      return { owner, accessToken }
    })
  }

  static async updateStatus(_id: string | Types.ObjectId, status: EOwnerStatus) {
    return await super.handleResponse(async () => {
      return await OwnerModel.updateOne({ _id }, { $set: { status } })
    })
  }

  static async getOwnerById(id: string | Types.ObjectId) {
    return await this.validate(id)
  }

  static async sendVerifyEmail(email: string) {
    return await super.handleResponse(async () => {
      const owner = await OwnerModel.findOne({ email })
      if (!owner) return Promise.reject(new CustomError("Email không tồn tại", HttpStatusCode.BAD_REQUEST))
      const {
        data: { isSent }
      } = await MailController.sendVerifyEmail(email, "owner/verify-email")
      if (!isSent) return Promise.reject(new CustomError("Gửi email xác thực thất bại", HttpStatusCode.BAD_REQUEST))
      return isSent
    })
  }

  static async verifyEmail({ email, token }: { email: string; token: string }) {
    return await super.handleResponse(async () => {
      const isMatch = await MailController.verifyEmail({ email, token })
      if (!isMatch) return Promise.reject(new CustomError("Token không hợp lệ", HttpStatusCode.BAD_REQUEST))
      const verifiedOwner = await OwnerModel.updateOne({ email }, { $set: { isEmailVerified: true } })
      if (!verifiedOwner) return Promise.reject(new CustomError("Email không hợp lệ", HttpStatusCode.BAD_REQUEST))
      return isMatch
    })
  }

  static async forgotPassword(email: string) {
    return await super.handleResponse(async () => {
      const owner = await OwnerModel.findOne({ email })
      if (!owner) return Promise.reject(new CustomError("Email không tồn tại", HttpStatusCode.BAD_REQUEST))
      if (!owner.isEmailVerified) {
        return Promise.reject(new CustomError("Email chưa được xác thực", HttpStatusCode.BAD_REQUEST))
      }
      const {
        data: { hashedPassword }
      } = await MailController.sendForgotPasswordEmail(email)
      await CredentialController.getCredential(owner._id)
      await CredentialController.updateCredential(owner._id, hashedPassword)
    })
  }
}

export default OwnerController
