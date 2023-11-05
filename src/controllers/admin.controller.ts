import { Types } from "mongoose"
import { EOwnerStatus } from "../enum"
import OwnerController from "./owner.controller"

class AdminController {
  static async ownerRegisterApproval(_id: string | Types.ObjectId, status: EOwnerStatus) {
    try {
      await OwnerController.updateStatus(_id, status)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export default AdminController
