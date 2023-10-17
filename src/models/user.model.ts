import { PaginateModel, Schema, model } from "mongoose"
import { SCHEMA } from "./schema-name"
import IUser from "../interface/user/user.interface"
import mongoosePaginate from "mongoose-paginate-v2"

const UserModel = new Schema<IUser>(
  {},
  {
    timestamps: true,
    versionKey: false
  }
)

UserModel.plugin(mongoosePaginate)

export default model<IUser, PaginateModel<IUser>>(SCHEMA.USERS, UserModel)
