import { Types } from "mongoose"
import { CredentialModel } from "../models"
import bcrypt from "bcryptjs"
import jwt, { JwtPayload } from "jsonwebtoken"
import { CustomError, HttpStatusCode } from "../helper"

class CredentialController {
  static async getCredential(userId: string | Types.ObjectId) {
    const credential = await CredentialModel.findOne({
      userId: userId
    })
    if (!credential) return Promise.reject(new CustomError("Tài khoản không tồn tại", HttpStatusCode.BAD_REQUEST))
    return credential
  }

  static async updateCredential(userId: string | Types.ObjectId, password: string) {
    const credential = await CredentialModel.findOneAndUpdate({ userId: userId }, { $set: { password } }, { new: true })
    if (!credential) return Promise.reject(new CustomError("Tài khoản không tồn tại", HttpStatusCode.BAD_REQUEST))
    return credential
  }

  static async compare(pwd: string, cmpPwd: string) {
    const isMatch = await bcrypt.compare(pwd, cmpPwd)
    return isMatch
  }

  static JWTSign({ role, userId }: Pick<JwtPayload, "role" | "userId">, expiresIn: string = "1y") {
    return jwt.sign({ userId: userId, role }, process.env.JWT_SECRET!, { expiresIn })
  }

  static async hash(password: string) {
    return await bcrypt.hash(password, 10)
  }
}

export default CredentialController
