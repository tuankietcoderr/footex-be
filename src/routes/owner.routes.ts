import { Request, Response, Router } from "express"
import { OwnerController } from "../controllers"
import { HttpStatusCode, ResponseHelper } from "../helper"
import { IOwner, IRouter } from "../interface"
import { AuthMiddleware, BodyFieldMiddleware } from "../middleware"
import { ERole } from "../enum"

class OwnerRoutes implements IRouter {
  readonly router: Router = Router()
  readonly path: string = "/owner"

  private readonly PATHS = {
    ROOT: this.path,
    SIGN_IN: `${this.path}/signin`,
    SIGN_UP: `${this.path}/signup`,
    VERIFY_EMAIL: `${this.path}/verify-email`,
    SEND_VERIFY_EMAIL: `${this.path}/send-verify-email`,
    FORGOT_PASSWORD: `${this.path}/forgot-password`
  }

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.post(
      this.PATHS.SIGN_UP,
      BodyFieldMiddleware.mustHaveFields<IOwner>("email", "phoneNumber", "name", "password"),
      BodyFieldMiddleware.doNotAllowFields<IOwner>("isEmailVerified", "status"),
      OwnerRoutes.signUp
    )
    this.router.post(this.PATHS.SIGN_IN, BodyFieldMiddleware.mustHaveFields<IOwner>("password"), OwnerRoutes.signIn)
    this.router.post(this.PATHS.SEND_VERIFY_EMAIL, OwnerRoutes.sendVerifyEmail)
    this.router.get(this.PATHS.VERIFY_EMAIL, OwnerRoutes.verifyEmail)
    this.router.get(this.PATHS.ROOT, AuthMiddleware.verifyRoles([ERole.OWNER]), OwnerRoutes.getCurrentOwner)
    this.router.post(this.PATHS.FORGOT_PASSWORD, OwnerRoutes.forgotPassword)
  }

  private static async signUp(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const {
        data: { accessToken, newOwner: data }
      } = await OwnerController.signUp(req.body)
      return ResponseHelper.successfulResponse(res, "Đăng ký tài khoản thành công!", HttpStatusCode.CREATED, {
        data,
        accessToken
      })
    })
  }

  private static async signIn(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const {
        data: { accessToken, owner: data }
      } = await OwnerController.signIn(req.body)
      return ResponseHelper.successfulResponse(res, "Đăng nhập thành công!", HttpStatusCode.OK, { data, accessToken })
    })
  }

  private static async sendVerifyEmail(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { email } = req.query
      await OwnerController.sendVerifyEmail(email as string)
      return ResponseHelper.successfulResponse(res, "Gửi email xác thực email thành công!", HttpStatusCode.OK)
    })
  }

  private static async verifyEmail(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { email, token } = req.query
      await OwnerController.verifyEmail({ email: email as string, token: token as string })
      return ResponseHelper.successfulResponse(res, "Xác thực email thành công!", HttpStatusCode.OK)
    })
  }

  private static async forgotPassword(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { email } = req.query
      await OwnerController.forgotPassword(email as string)
      return ResponseHelper.successfulResponse(res, "Gửi email đặt lại mật khẩu thành công!", HttpStatusCode.OK)
    })
  }

  private static async getCurrentOwner(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await OwnerController.getOwnerById(req.userId)
      return ResponseHelper.successfulResponse(res, "Lấy thông tin chủ nhà thành công!", HttpStatusCode.OK, { data })
    })
  }
}

export default OwnerRoutes
