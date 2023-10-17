import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import User from "../models/user.model"
import { ERole } from "../enum"
import { HttpStatusCode, ResponseHelper } from "../helper"

class AuthMiddleware {
  static checkValidRoles() {
    return (req: Request, res: Response, next: NextFunction) => {
      const { role } = req.body
      if (!role) {
        return next()
      }
      const isValidRole = Object.values(ERole).includes(role)
      if (isValidRole) {
        return next()
      }
      return ResponseHelper.errorResponse(res, "Role không hợp lệ", 400)
    }
  }
  static verifyRoles(roles: ERole[]) {
    return async function (req: Request, res: Response, next: NextFunction) {
      const authHeader = req.header("Authorization")
      const token = authHeader && authHeader.split(" ")[1]

      if (!token) {
        return ResponseHelper.errorResponse(res, `Không có token nào được cung cấp`, HttpStatusCode.FORBIDDEN)
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload

        req.user_id = decoded.user_id

        const user = await User.findById(decoded.user_id)
        if (!user) {
          return ResponseHelper.errorResponse(res, `Token không hợp lệ`, HttpStatusCode.UNAUTHORIZED)
        }
        if (!roles) return next()
        if (!roles.includes(user.role)) {
          return ResponseHelper.errorResponse(
            res,
            `Bạn không phải là ${roles.join("/")} nên bạn không có quyền truy cập nội dung này.`,
            HttpStatusCode.FORBIDDEN
          )
        }
        next()
      } catch {
        return ResponseHelper.errorResponse(res, `Token không hợp lệ`, HttpStatusCode.UNAUTHORIZED)
      }
    }
  }
}

export default AuthMiddleware
