import { Response } from "express"
import HttpStatusCode from "./status-code.helper"

class ResponseHelper {
  static successfulResponse(res: Response, message: string, statusCode: number = HttpStatusCode.OK, rest: any) {
    return res.status(statusCode).json({ message, success: true, ...rest })
  }

  static errorResponse(res: Response, message: string, statusCode: number = HttpStatusCode.INTERNAL_SERVER_ERROR) {
    return res.status(statusCode).json({ message, success: false })
  }
}

export default ResponseHelper
