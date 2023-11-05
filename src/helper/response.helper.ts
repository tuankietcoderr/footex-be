import { Request, Response } from "express"
import HttpStatusCode from "./status-code.helper"
import { ICustomError } from "./error.helper"

class ResponseHelper {
  static async wrapperHandler<T>(res: Response, cb: () => Promise<T>) {
    try {
      await cb()
    } catch (err: any) {
      const error = err as ICustomError
      return ResponseHelper.errorResponse(res, error.message || err.message, error.statusCode)
    }
  }

  static successfulResponse(res: Response, message: string, statusCode: number = HttpStatusCode.OK, rest?: any) {
    return res.status(statusCode).json({ message, success: true, ...rest })
  }

  static errorResponse(res: Response, message: string, statusCode: number = HttpStatusCode.INTERNAL_SERVER_ERROR) {
    return res.status(statusCode).json({ message, success: false })
  }
}

export default ResponseHelper
