import { Request, Response, Router } from "express"
import { IGuest, IRouter } from "../interface"
import { HttpStatusCode, ResponseHelper } from "../helper"
import { GuestController } from "../controllers"
import { AuthMiddleware, BodyFieldMiddleware } from "../middleware"
import { ERole } from "../enum"

class GuestRoutes implements IRouter {
  readonly router: Router = Router()
  readonly path: string = "/guest"

  private readonly PATHS = {
    ROOT: this.path,
    EMAIL: `${this.path}/email`,
    SIGN_IN: `${this.path}/signin`,
    SIGN_UP: `${this.path}/signup`,
    VERIFY_EMAIL: `${this.path}/verify-email`,
    SEND_VERIFY_EMAIL: `${this.path}/send-verify-email`,
    FORGOT_PASSWORD: `${this.path}/password/forgot`,
    CHANGE_PASSWORD: `${this.path}/password/change`,
    ID: `${this.path}/:id`,
    SEARCH_BY_EMAIL_OR_PHONE_NUMBER: `${this.path}/search/:emailOrPhoneNumber`,
    AUTHORIZE: `${this.path}/authorize`
  }

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.post(
      this.PATHS.SIGN_UP,
      BodyFieldMiddleware.mustHaveFields<IGuest>("email", "phoneNumber", "name", "password"),
      BodyFieldMiddleware.doNotAllowFields<IGuest>("isEmailVerified"),
      GuestRoutes.signUp
    )
    this.router.post(this.PATHS.SIGN_IN, BodyFieldMiddleware.mustHaveFields<IGuest>("password"), GuestRoutes.signIn)
    this.router.post(this.PATHS.SEND_VERIFY_EMAIL, GuestRoutes.sendVerifyEmail)
    this.router.get(this.PATHS.VERIFY_EMAIL, GuestRoutes.verifyEmail)
    this.router.post(this.PATHS.FORGOT_PASSWORD, GuestRoutes.forgotPassword)
    this.router.get(this.PATHS.ROOT, AuthMiddleware.verifyRoles([ERole.GUEST]), GuestRoutes.getCurrentGuest)
    this.router.put(this.PATHS.ROOT, AuthMiddleware.verifyRoles([ERole.GUEST]), GuestRoutes.updateGuestInfo)
    this.router.put(this.PATHS.EMAIL, AuthMiddleware.verifyRoles([ERole.GUEST]), GuestRoutes.updateGuestEmail)
    this.router.get(
      this.PATHS.SEARCH_BY_EMAIL_OR_PHONE_NUMBER,
      AuthMiddleware.verifyRoles(),
      GuestRoutes.getByPhoneNumber
    )
    this.router.get(this.PATHS.AUTHORIZE, AuthMiddleware.verifyRoles([ERole.GUEST]), GuestRoutes.authorize)
    this.router.get(this.PATHS.ID, GuestRoutes.getById)
    this.router.put(
      this.PATHS.CHANGE_PASSWORD,
      AuthMiddleware.verifyRoles([ERole.GUEST]),
      BodyFieldMiddleware.mustHaveFields("oldPassword", "newPassword"),
      GuestRoutes.changePassword
    )
  }

  private static async signUp(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const {
        data: { accessToken, newGuest: data }
      } = await GuestController.signUp(req.body)
      return ResponseHelper.successfulResponse(res, "Đăng ký tài khoản thành công!", HttpStatusCode.CREATED, {
        data,
        accessToken
      })
    })
  }

  private static async signIn(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const {
        data: { accessToken, guest: data }
      } = await GuestController.signIn(req.body)
      return ResponseHelper.successfulResponse(res, "Đăng nhập thành công!", HttpStatusCode.OK, { data, accessToken })
    })
  }

  private static async sendVerifyEmail(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { email } = req.query
      await GuestController.sendVerifyEmail(email as string)
      return ResponseHelper.successfulResponse(res, "Gửi email xác thực thành công!", HttpStatusCode.OK)
    })
  }

  private static async verifyEmail(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { email, token } = req.query as { email: string; token: string }
      await GuestController.verifyEmail({ email, token })
      return ResponseHelper.successfulResponse(res, "Xác thực email thành công!", HttpStatusCode.OK)
    })
  }

  private static async forgotPassword(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { email } = req.query
      await GuestController.forgotPassword(email as string)
      return ResponseHelper.successfulResponse(res, "Gửi email đặt lại mật khẩu thành công!", HttpStatusCode.OK)
    })
  }

  private static async changePassword(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      await GuestController.changePassword(req.userId, req.body)
      return ResponseHelper.successfulResponse(res, "Đổi mật khẩu thành công!", HttpStatusCode.OK)
    })
  }

  private static async getCurrentGuest(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await GuestController.getById(req.userId)
      return ResponseHelper.successfulResponse(res, "Lấy thông tin khách hàng thành công!", HttpStatusCode.OK, { data })
    })
  }

  private static async updateGuestInfo(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await GuestController.updateInfo(req.userId, req.body)
      return ResponseHelper.successfulResponse(res, "Cập nhật thông tin khách hàng thành công!", HttpStatusCode.OK, {
        data
      })
    })
  }

  private static async updateGuestEmail(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await GuestController.updateEmail(req.userId, req.body.email)
      return ResponseHelper.successfulResponse(res, "Cập nhật thông tin khách hàng thành công!", HttpStatusCode.OK, {
        data
      })
    })
  }

  private static async getByPhoneNumber(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await GuestController.getByEmailOrPhoneNumber(req.params.emailOrPhoneNumber)
      return ResponseHelper.successfulResponse(res, "Lấy thông tin khách hàng thành công!", HttpStatusCode.OK, { data })
    })
  }

  private static async authorize(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await GuestController.authorize(req.userId)
      return ResponseHelper.successfulResponse(res, "Xác thực thành công!", HttpStatusCode.OK, { data })
    })
  }

  private static async getById(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await GuestController.getById(req.params.id)
      return ResponseHelper.successfulResponse(res, "Lấy thông tin khách hàng thành công!", HttpStatusCode.OK, { data })
    })
  }
}

export default GuestRoutes
