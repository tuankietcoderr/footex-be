import { NextFunction, Request, Response } from "express"

class BodyFieldMiddleware {
  static mustHaveFields<T = string>(...fields: (keyof T)[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      const body = req.body
      const leftFields = []
      for (const field of fields) {
        if (body[field] === undefined || body[field] === null) {
          leftFields.push(field)
        }
      }

      if (leftFields.length > 0) {
        return res.status(400).json({ success: false, message: `Vui lòng điền đủ các field: ${leftFields.join(", ")}` })
      }

      next()
    }
  }

  static doNotAllowFields<T = string>(...fields: (keyof T)[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      const body = req.body

      for (const field of fields) {
        if (body[field]) {
          return res.status(400).json({ success: false, message: `Field ${String(field)} không được cho phép` })
        }
      }

      next()
    }
  }
}

export default BodyFieldMiddleware
