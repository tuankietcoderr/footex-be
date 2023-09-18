import nodemailer from "nodemailer"
import { MailOptions } from "nodemailer/lib/smtp-transport"

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD
  }
})

function mailOptions({ to, subject, text }: MailOptions) {
  return {
    from: process.env.SMTP_USER,
    to,
    subject,
    text
  }
}

function sendMail({ to, subject, text }: MailOptions) {
  return transporter.sendMail(mailOptions({ to, subject, text }))
}

export { sendMail }
