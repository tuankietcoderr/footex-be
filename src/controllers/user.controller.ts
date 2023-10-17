import { Types } from "mongoose"
import { ERole } from "../enum"
import { IUser } from "../interface"
import { SCHEMA } from "../models/schema-name"
import { UserModel } from "../models"

class UserController<T = any> implements IUser<T> {
  password: string
  name: string
  email: string
  avatar: string
  phoneNumber: string
  isEmailVerified: boolean
  role: ERole
  refPath: string
  attributes: T | string | Types.ObjectId

  constructor() {
    this.password = ""
    this.name = ""
    this.email = ""
    this.avatar = ""
    this.phoneNumber = ""
    this.isEmailVerified = false
    this.role = ERole.GUEST
    this.refPath = SCHEMA.GUESTS
    this.attributes = ""
  }
}

export default UserController
