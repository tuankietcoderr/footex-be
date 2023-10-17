import { Types } from "mongoose"
import { CredentialModel } from "../models"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

class CredentialController {
  static async getCredential(userId: string | Types.ObjectId) {
    const credential = await CredentialModel.findOne({
      user_id: userId
    })

    return credential
  }

  static async checkPassword(pwd: string, cmpPwd: string) {
    const isMatch = await bcrypt.compare(pwd, cmpPwd)
    return isMatch
  }

  static JWTSign(userId: string | Types.ObjectId, expiresIn: string = "1y") {
    return jwt.sign({ user_id: userId.toString() }, process.env.JWT_SECRET!, { expiresIn })
  }

  static async hash(password: string) {
    return await bcrypt.hash(password, 10)
  }
}

export default CredentialController
