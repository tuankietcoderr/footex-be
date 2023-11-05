import { CustomError, HttpStatusCode } from "../helper"
import emailContentProvider from "../mail/template"
import { MailService } from "../service"
import BaseController from "./base.controller"
import CredentialController from "./credential.controller"

class MailController extends BaseController {
  private static readonly _appName: string = process.env.APP_NAME
  private static _mailService: MailService = new MailService()

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
}

export default MailController
