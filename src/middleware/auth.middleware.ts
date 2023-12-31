import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import { EOwnerStatus, ERole } from "../enum"
import { HttpStatusCode, ResponseHelper } from "../helper"
import { OwnerModel } from "../models"

class AuthMiddleware {
  static verifyRoles(roles?: ERole[]) {
    return async function (req: Request, res: Response, next: NextFunction) {
      const authHeader = req.header("Authorization")
      const token = authHeader && authHeader.split(" ")[1]
      if (!token) {
        return ResponseHelper.errorResponse(res, `Không có token nào được cung cấp`, HttpStatusCode.FORBIDDEN)
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload

        req.userId = decoded.userId
        req.role = decoded.role

        if (!roles) return next()
        !roles.includes(ERole.ADMIN) && roles.push(ERole.ADMIN)
        if (!roles.includes(decoded.role)) {
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
