import { Request, Response, Router } from "express"
import { IRouter } from "../interface"
import { HttpStatusCode, ICustomError, ResponseHelper } from "../helper"
import { EOwnerStatus, ERole } from "../enum"
import { AuthMiddleware } from "../middleware"
import { AdminController } from "../controllers"

class AdminRoutes implements IRouter {
  readonly path: string = "/admin"
  readonly router: Router = Router()

  private readonly PATHS = {
    MANAGE_OWNER: {
      ROOT: `${this.path}/owner`,
      APPROVE: `${this.path}/owner/approve/:id`,
      OWNER: `${this.path}/owner/:id`,
      OWNER_TOURNAMENTS: `${this.path}/owner/:id/tournaments`
    }
  }

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.put(this.PATHS.MANAGE_OWNER.APPROVE, AuthMiddleware.verifyRoles([ERole.ADMIN]), this.approveOwner)
  }

  private async approveOwner(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      await AdminController.ownerRegisterApproval(req.params.id, EOwnerStatus.ACTIVE)
      return ResponseHelper.successfulResponse(res, "Phê duyệt chủ sân bóng thành công!", HttpStatusCode.OK)
    })
  }
}

export default AdminRoutes
