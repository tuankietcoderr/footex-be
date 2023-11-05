import { Types } from "mongoose"
import { EOwnerStatus, ERole } from "../enum"
import { CredentialModel, OwnerModel } from "../models"
import BaseController from "./base.controller"
import { IGuest, IOwner } from "../interface"
import CredentialController from "./credential.controller"
import MailController from "./mail.controller"

class OwnerController extends BaseController {
  constructor() {
    super()
  }

  static async validateOwner(id: string | Types.ObjectId) {
    return await super.handleResponse(async () => {
      const owner = await OwnerModel.findById(id)
      if (!owner) return Promise.reject(new Error("Owner không tồn tại"))
      return owner
    })
  }

  static async signUp(body: IOwner) {
    return await super.handleResponse(async () => {
      const { email, phoneNumber, password } = body
      const owner = await OwnerModel.findOne({ $or: [{ email }, { phoneNumber }] })
      if (owner) return Promise.reject(new Error("Email hoặc số điện thoại đã tồn tại"))

      const newOwner = new OwnerModel(body)
      const bcryptPassword = await CredentialController.hash(password)
      const newCredential = new CredentialModel({
        user_id: newOwner._id,
        password: bcryptPassword
      })
      await newCredential.save()
      await newOwner.save()
      const accessToken = CredentialController.JWTSign({ role: ERole.OWNER, user_id: newOwner._id.toString() })

      return { newOwner, accessToken }
    })
  }

  static async signIn({ emailOrPhoneNumber, password }: { emailOrPhoneNumber: string; password: string }) {
    return await super.handleResponse(async () => {
      const owner = await OwnerModel.findOne({
        $or: [{ email: emailOrPhoneNumber }, { phoneNumber: emailOrPhoneNumber }]
      })
      if (!owner) return Promise.reject(new Error("Email hoặc số điện thoại không tồn tại"))

      const credential = await CredentialController.getCredential(owner._id)
      const isMatch = await CredentialController.compare(password, credential.password)
      if (!isMatch) return Promise.reject(new Error("Mật khẩu không đúng"))
      const accessToken = CredentialController.JWTSign({ role: ERole.OWNER, user_id: owner._id.toString() })
      return { owner, accessToken }
    })
  }

  static async updateStatus(_id: string | Types.ObjectId, status: EOwnerStatus) {
    return await super.handleResponse(async () => {
      return await OwnerModel.updateOne({ _id }, { $set: { status } })
    })
  }

  static async getOwnerById(id: string | Types.ObjectId) {
    return await this.validateOwner(id)
  }

  static async sendVerifyEmail(email: string) {
    return await super.handleResponse(async () => {
      const owner = await OwnerModel.findOne({ email })
      if (!owner) return Promise.reject(new Error("Email không tồn tại"))
      const {
        data: { isSent }
      } = await MailController.sendVerifyEmail(email, "owner/verify-email")
      if (!isSent) return Promise.reject(new Error("Gửi email xác thực thất bại"))
      return isSent
    })
  }

  static async verifyEmail({ email, token }: { email: string; token: string }) {
    return await super.handleResponse(async () => {
      const isMatch = await MailController.verifyEmail({ email, token })
      if (!isMatch) return Promise.reject(new Error("Token không hợp lệ"))
      const verifiedOwner = await OwnerModel.updateOne({ email }, { $set: { isEmailVerified: true } })
      if (!verifiedOwner) return Promise.reject(new Error("Email không hợp lệ"))
      return isMatch
    })
  }

  static async forgotPassword(email: string) {
    return await super.handleResponse(async () => {
      const owner = await OwnerModel.findOne({ email })
      if (!owner) return Promise.reject(new Error("Email không tồn tại"))
      if (!owner.isEmailVerified) {
        return Promise.reject(new Error("Email chưa được xác thực"))
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
