import { Types } from "mongoose"
import { GuestModel } from "../models"
import { IGuest, ITeam } from "../interface"
import TeamController from "./team.controller"
import BaseController from "./base.controller"
import MailController from "./mail.controller"
import CredentialController from "./credential.controller"

class GuestController extends BaseController {
  static async create(guest: IGuest) {
    return await super.handleResponse(async () => {
      const { email, phoneNumber } = guest
      const guestExist = await GuestModel.findOne({ $or: [{ email }, { phoneNumber }] })
      if (guestExist) return Promise.reject(new Error("Email hoặc số điện thoại đã tồn tại"))
      const newGuest = await GuestModel.create(guest)
      return newGuest
    })
  }

  static async getGuestById(id: string | Types.ObjectId) {
    try {
      const guest = await GuestModel.findById(id)
      return Promise.resolve({ data: guest })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  static async createTeam(team: ITeam) {
    try {
      const { data } = await TeamController.create(team)
      return Promise.resolve({ data })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  static async sendVerifyEmail(email: string) {
    return await super.handleResponse(async () => {
      const guest = await GuestModel.findOne({ email })
      if (!guest) return Promise.reject(new Error("Email không tồn tại"))
      const {
        data: { isSent }
      } = await MailController.sendVerifyEmail(email, "guest/verify-email")
      if (!isSent) return Promise.reject(new Error("Gửi email xác thực thất bại"))
      return isSent
    })
  }

  static async verifyEmail({ email, token }: { email: string; token: string }) {
    return await super.handleResponse(async () => {
      const isMatch = await MailController.verifyEmail({ email, token })
      if (!isMatch) return Promise.reject(new Error("Token không hợp lệ"))
      const verifiedGuest = await GuestModel.updateOne({ email }, { $set: { isEmailVerified: true } })
      if (!verifiedGuest) return Promise.reject(new Error("Email không hợp lệ"))
      return isMatch
    })
  }

  static async forgotPassword(email: string) {
    return await super.handleResponse(async () => {
      const guest = await GuestModel.findOne({ email })
      if (!guest) return Promise.reject(new Error("Email không tồn tại"))
      if (!guest.isEmailVerified) {
        return Promise.reject(new Error("Email chưa được xác thực"))
      }
      const {
        data: { hashedPassword }
      } = await MailController.sendForgotPasswordEmail(email)
      await CredentialController.getCredential(guest._id)
      await CredentialController.updateCredential(guest._id, hashedPassword)
    })
  }
}

export default GuestController
