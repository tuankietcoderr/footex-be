import { EReportStatus } from "../enum"
import { CustomError, HttpStatusCode } from "../helper"
import { IBranch, IField } from "../interface"
import emailContentProvider from "../mail/template"
import { MailService } from "../service"
import BaseController from "./base.controller"
import CredentialController from "./credential.controller"

class MailController extends BaseController {
  private static readonly _appName: string = process.env.APP_NAME
  private static _mailService: MailService = new MailService()

  constructor() {
    super()
  }

  static async sendVerifyEmail(email: string, route: string) {
    return await super.handleResponse(async () => {
      const hashedEmail = await CredentialController.hash(email)
      this._mailService
        .sendMail({
          to: email,
          subject: `[${this._appName}] Xác thực email`,
          html: emailContentProvider({
            title: "Xác thực email",
            children: `
            <p>Chào bạn,</p>
            <p>Bạn đã đăng ký thành công tài khoản</p>
            <p>Vui lòng xác thực email bằng cách nhấn vào link sau: <a href="${process.env.URL}/${route}?email=${email}&token=${hashedEmail}">Xác thực</a></p>
            <p>Trân trọng,</p>
            <p>Đội ngũ ${this._appName}</p>
          `
          })
        })
        .catch((err) => {
          Promise.reject(new CustomError(err.message, HttpStatusCode.INTERNAL_SERVER_ERROR))
        })
      return { isSent: true }
    })
  }

  static async verifyEmail({ email, token }: { email: string; token: string }) {
    return await super.handleResponse(async () => {
      const isMatch = await CredentialController.compare(email, token)
      if (!isMatch) {
        return Promise.reject(new CustomError("Email không hợp lệ", HttpStatusCode.BAD_REQUEST))
      }
      return isMatch
    })
  }

  static async sendForgotPasswordEmail(email: string) {
    return await super.handleResponse(async () => {
      const randomPassword = Math.random().toString(36).slice(-8)
      const hashedPassword = await CredentialController.hash(randomPassword)
      this._mailService.sendMail({
        to: email as string,
        subject: `[${this._appName}] Đặt lại mật khẩu của bạn`,
        html: emailContentProvider({
          title: "Đặt lại mật khẩu",
          children: `
          <p>Chào bạn,</p>
          <p>Đây là mật khẩu được đặt lại của bạn: <b>${randomPassword}</b>.<br />
          Hãy sử dụng mật khẩu nãy để đăng nhập bạn nhé!</p>
          <p>Bạn cũng có thể thay đổi lại mật khẩu sau trong phần cài đặt người dùng.</p>`
        })
      })
      return { hashedPassword }
    })
  }

  static async sendChangePasswordEmail(email: string) {
    return await super.handleResponse(async () => {
      this._mailService.sendMail({
        to: email as string,
        subject: `[${this._appName}] Thay đổi mật khẩu thành công`,
        html: emailContentProvider({
          title: "Thay đổi mật khẩu thành công",
          children: `
          <p>Chào bạn,</p>
          <p>Bạn đã thay đổi mật khẩu thành công.</p>
          <p>Nếu bạn không thực hiện hành động này, vui lòng liên hệ với chúng tôi để được hỗ trợ.</p>
          <p>Trân trọng,</p>
          <p>Đội ngũ ${this._appName}</p>`
        })
      })
      return { isSent: true }
    })
  }

  static async sendObjectStatusEmail(email: string, object: string, status: string) {
    return await super.handleResponse(async () => {
      this._mailService.sendMail({
        to: email as string,
        subject: `[${this._appName}] Thông báo thay đổi trạng thái`,
        html: emailContentProvider({
          title: "Thông báo thay đổi trạng thái",
          children: `
          <p>Chào bạn,</p>
          <p>Đây là email thông báo thay đổi trạng thái.</p>
          <p>Đối tượng: <b>${object}</b></p>
          <p>Trạng thái: <b>${status}</b></p>
          <p>Trân trọng,</p>
          <p>Đội ngũ ${this._appName}</p>`
        })
      })
      return { isSent: true }
    })
  }

  static async sendBookedEmail(email: string) {
    return await super.handleResponse(async () => {
      this._mailService.sendMail({
        to: email as string,
        subject: `[${this._appName}] Thông báo đặt sân thành công`,
        html: emailContentProvider({
          title: "Thông báo đặt sân thành công",
          children: `
          <p>Chào bạn,</p>
          <p>Đây là email thông báo đặt sân thành công.</p>
          <p>Trân trọng,</p>
          <p>Đội ngũ ${this._appName}</p>`
        })
      })
      return { isSent: true }
    })
  }

  static async sendOwnerBookedEmail(email: string, fieldName: string, branchName: string) {
    return await super.handleResponse(async () => {
      this._mailService.sendMail({
        to: email as string,
        subject: `[${this._appName}] Thông báo đặt sân`,
        html: emailContentProvider({
          title: "Thông báo đặt sân",
          children: `
          <p>Chào chủ sân,</p>
          <p>Đây là email thông báo rằng có người đã đặt sân <b>${fieldName}</b> của chi nhánh <b>${branchName}</b>.</p>
          <p>Trân trọng,</p>
          <p>Đội ngũ ${this._appName}</p>`
        })
      })
      return { isSent: true }
    })
  }
}

export default MailController
