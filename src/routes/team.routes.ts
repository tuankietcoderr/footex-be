import { Request, Response, Router } from "express"
import { IRouter, ITeam } from "../interface"
import { HttpStatusCode, ResponseHelper } from "../helper"
import { TeamController } from "../controllers"
import { AuthMiddleware, BodyFieldMiddleware } from "../middleware"
import { ERole } from "../enum"

class TeamRoutes implements IRouter {
  readonly path: string = "/team"
  readonly router: Router = Router()
  private readonly PATHS = {
    ROOT: this.path,
    ID: `${this.path}/:id`,
    CAPTAIN: `${this.path}/captain`,
    GUEST: `${this.path}/guest`,
    LEAVE: `${this.path}/:teamId/leave`,
    KICK: `${this.path}/:teamId/kick`
  }
  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.post(
      this.PATHS.ROOT,
      AuthMiddleware.verifyRoles([ERole.GUEST]),
      BodyFieldMiddleware.doNotAllowFields<ITeam>("captain", "members", "status"),
      BodyFieldMiddleware.mustHaveFields<ITeam>("name"),
      TeamRoutes.createTeam
    )
    this.router.get(this.PATHS.ID, AuthMiddleware.verifyRoles([ERole.GUEST]), TeamRoutes.getTeamById)
    this.router.put(
      this.PATHS.ID,
      AuthMiddleware.verifyRoles([ERole.GUEST]),
      BodyFieldMiddleware.doNotAllowFields<ITeam>("captain", "status", "members"),
      TeamRoutes.updateTeamInfo
    )
    this.router.get(this.PATHS.ROOT, AuthMiddleware.verifyRoles([ERole.GUEST]), TeamRoutes.getTeams)
    this.router.get(this.PATHS.CAPTAIN, AuthMiddleware.verifyRoles([ERole.GUEST]), TeamRoutes.getCaptainTeams)
    this.router.get(this.PATHS.GUEST, AuthMiddleware.verifyRoles([ERole.GUEST]), TeamRoutes.getGuestJointTeams)
    this.router.delete(this.PATHS.ID, AuthMiddleware.verifyRoles([ERole.GUEST]), TeamRoutes.deleteTeam)
    this.router.delete(this.PATHS.LEAVE, AuthMiddleware.verifyRoles([ERole.GUEST]), TeamRoutes.leaveTeam)
  }

  static async createTeam(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await TeamController.create({ ...req.body, captain: req.userId })
      return ResponseHelper.successfulResponse(res, "Tạo đội bóng thành công!", HttpStatusCode.CREATED, { data })
    })
  }

  static async getTeamById(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await TeamController.getById(req.params.id)
      return ResponseHelper.successfulResponse(res, "Lấy thông tin đội bóng thành công!", HttpStatusCode.OK, { data })
    })
  }

  static async updateTeamInfo(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await TeamController.updateInfo(req.params.id, req.body)
      return ResponseHelper.successfulResponse(res, "Cập nhật thông tin đội bóng thành công!", HttpStatusCode.OK, {
        data
      })
    })
  }

  static async getTeams(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await TeamController.getAll()
      return ResponseHelper.successfulResponse(res, "Lấy danh sách đội bóng thành công!", HttpStatusCode.OK, { data })
    })
  }

  static async leaveTeam(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await TeamController.leave(req.params.teamId, req.body.memberId)
      return ResponseHelper.successfulResponse(res, "Rời đội bóng thành công!", HttpStatusCode.OK, { data })
    })
  }

  static async deleteTeam(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await TeamController.delete(req.params.id)
      return ResponseHelper.successfulResponse(res, "Xóa đội bóng thành công!", HttpStatusCode.OK, { data })
    })
  }

  static async getCaptainTeams(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await TeamController.getCaptainTeams(req.userId)
      return ResponseHelper.successfulResponse(res, "Lấy danh sách đội bóng thành công!", HttpStatusCode.OK, { data })
    })
  }

  static async getGuestJointTeams(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await TeamController.getGuestJointTeams(req.userId)
      return ResponseHelper.successfulResponse(res, "Lấy danh sách đội bóng thành công!", HttpStatusCode.OK, { data })
    })
  }
}

export default TeamRoutes
