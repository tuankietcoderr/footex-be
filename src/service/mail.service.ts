import nodemailer from "nodemailer"
import { MailOptions } from "nodemailer/lib/smtp-transport"
class MailService {
  private _transporter: nodemailer.Transporter

  constructor() {
    this._transporter = this.initializeTransporter()
  }

  private initializeTransporter() {
    return nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
      }
    })
  }

  private mailOptions(options: MailOptions) {
    return {
      from: process.env.SMTP_USER,
      ...options
    }
  }

  async sendMail(options: MailOptions) {
    try {
      await this._transporter.sendMail(this.mailOptions(options))
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export default MailService
