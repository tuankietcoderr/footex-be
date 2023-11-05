import { Types } from "mongoose"
import { CredentialModel } from "../models"
import bcrypt from "bcryptjs"
import jwt, { JwtPayload } from "jsonwebtoken"

class CredentialController {
  static async getCredential(userId: string | Types.ObjectId) {
    const credential = await CredentialModel.findOne({
      user_id: userId
    })
    if (!credential) return Promise.reject(new Error("Tài khoản không tồn tại"))
    return credential
  }

  static async updateCredential(userId: string | Types.ObjectId, password: string) {
    const credential = await CredentialModel.findOneAndUpdate(
      { user_id: userId },
      { $set: { password } },
      { new: true }
    )
    if (!credential) return Promise.reject(new Error("Tài khoản không tồn tại"))
    return credential
  }

  static async compare(pwd: string, cmpPwd: string) {
    const isMatch = await bcrypt.compare(pwd, cmpPwd)
    return isMatch
  }

  static JWTSign({ role, user_id }: Pick<JwtPayload, "role" | "user_id">, expiresIn: string = "1y") {
    return jwt.sign({ user_id: user_id, role }, process.env.JWT_SECRET!, { expiresIn })
  }

  static async hash(password: string) {
    return await bcrypt.hash(password, 10)
  }
}

export default CredentialController
