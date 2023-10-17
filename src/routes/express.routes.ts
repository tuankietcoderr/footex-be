import { Router } from "express"
import { Types } from "mongoose"

class ExpressRoutes {
  static router: Router
  static stringToObjectId(v: string): Types.ObjectId {
    return new Types.ObjectId(v)
  }
}

export default ExpressRoutes
