import { NextFunction, Request, Response, Router } from "express"
import { AuthController } from "../controllers"
import { IRouter, IUser } from "../interface"
import { AuthMiddleware, BodyFieldMiddleware } from "../middleware"
import { ICustomError, ResponseHelper } from "../helper"

class AuthRoutes implements IRouter {
  public readonly path: string = "/auth"
  public readonly router: Router = Router()

  private readonly PATHS = {
    LOGIN: `${this.path}/signin`,
    SIGNUP: `${this.path}/signup`
  }

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    // SIGNIN
    this.router.post(
      this.PATHS.LOGIN,
      BodyFieldMiddleware.mustHaveFields("emailOrPhoneNumber", "password"),
      this.signin
    )
    // SIGNUP
    this.router.post(
      this.PATHS.SIGNUP,
      AuthMiddleware.checkValidRoles(),
      BodyFieldMiddleware.mustHaveFields<IUser>("email", "phoneNumber", "password", "name", "role"),
      BodyFieldMiddleware.doNotAllowFields<IUser>("attributes", "isEmailVerified", "refPath"),
      this.signUp
    )
  }

  private async signin(req: Request, res: Response) {
    try {
      const { emailOrPhoneNumber, password } = req.body
      const { accessToken, data } = await AuthController.signin({ emailOrPhoneNumber, password })
      return ResponseHelper.successfulResponse(res, "Đăng nhập thành công!", 200, { accessToken, data })
    } catch (err: any) {
      const error = err as ICustomError
      return ResponseHelper.errorResponse(res, error.message || err.message, error.statusCode)
    }
  }

  private async signUp(req: Request, res: Response) {
    try {
      const { accessToken, data } = await AuthController.signUp(req.body)
      return ResponseHelper.successfulResponse(res, "Đăng ký thành công!", 201, { accessToken, data })
    } catch (err: any) {
      const error = err as ICustomError
      return ResponseHelper.errorResponse(res, error.message || err.message, error.statusCode)
    }
  }
}

export default AuthRoutes
