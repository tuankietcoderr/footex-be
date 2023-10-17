import { CustomError, HttpStatusCode } from "../helper"
import { IUser } from "../interface"
import { CredentialModel, UserModel } from "../models"
import CredentialController from "./credential.controller"

class AuthController {
  public static verifyEmail(email: string): boolean {
    return true
  }
  public static async signin({ emailOrPhoneNumber, password }: { emailOrPhoneNumber: string; password: string }) {
    try {
      const user = await UserModel.findOne({
        $or: [{ email: emailOrPhoneNumber }, { phoneNumber: emailOrPhoneNumber }]
      })
      if (!user) {
        return Promise.reject(new CustomError("Người dùng không tồn tại", HttpStatusCode.BAD_REQUEST))
      }
      const credential = await CredentialController.getCredential(user._id)
      if (!credential) {
        return Promise.reject(new CustomError("Người dùng không tồn tại", HttpStatusCode.BAD_REQUEST))
      }

      const isMatch = await CredentialController.checkPassword(password, credential.password)
      if (!isMatch) {
        return Promise.reject(new CustomError("Mật khẩu không chính xác", HttpStatusCode.BAD_REQUEST))
      }

      const accessToken = CredentialController.JWTSign(user._id)
      return Promise.resolve({ accessToken, data: user })
    } catch (err) {
      return Promise.reject(err)
    }
  }

  public static async signUp(body: IUser) {
    try {
      const { phoneNumber, email, password } = body
      const user = await UserModel.findOne({ $or: [{ email }, { phoneNumber }] })
      if (user) {
        return Promise.reject(new CustomError("Email/Số điện thoại đã được sử dụng", HttpStatusCode.BAD_REQUEST))
      }
      const newUser = new UserModel(body)
      const bcryptPassword = await CredentialController.hash(password)
      const newCredential = new CredentialModel({
        user_id: newUser._id,
        password: bcryptPassword
      })

      await newCredential.save()
      await newUser.save()

      const accessToken = CredentialController.JWTSign(newUser._id)
      return Promise.resolve({ accessToken, data: newUser })
    } catch (err) {
      return Promise.reject(err)
    }
  }
}

export default AuthController
