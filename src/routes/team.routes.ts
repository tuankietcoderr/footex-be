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
    GUEST: `${this.path}/guest/:id`,
    LEAVE: `${this.path}/:id/leave`,
    KICK: `${this.path}/:id/kick`
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
    this.router.put(
      this.PATHS.ID,
      AuthMiddleware.verifyRoles([ERole.GUEST]),
      BodyFieldMiddleware.doNotAllowFields<ITeam>("captain", "status", "members"),
      TeamRoutes.updateTeamInfo
    )
    this.router.get(this.PATHS.ROOT, TeamRoutes.getTeams)
    this.router.get(this.PATHS.CAPTAIN, AuthMiddleware.verifyRoles([ERole.GUEST]), TeamRoutes.getCaptainTeams)
    this.router.get(this.PATHS.GUEST, TeamRoutes.getGuestJointTeams)
    this.router.delete(this.PATHS.ID, AuthMiddleware.verifyRoles([ERole.GUEST]), TeamRoutes.deleteTeam)
    this.router.delete(this.PATHS.LEAVE, AuthMiddleware.verifyRoles([ERole.GUEST]), TeamRoutes.leaveTeam)
    this.router.delete(this.PATHS.KICK, AuthMiddleware.verifyRoles([ERole.GUEST]), TeamRoutes.kickMember)
    this.router.get(this.PATHS.ID, TeamRoutes.getTeamById)
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
      const { data } = await TeamController.getAll(req.query)
      return ResponseHelper.successfulResponse(res, "Lấy danh sách đội bóng thành công!", HttpStatusCode.OK, { data })
    })
  }

  static async leaveTeam(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await TeamController.leave(req.params.id, req.userId)
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
      const { data } = await TeamController.getGuestJointTeams(req.params.id)
      return ResponseHelper.successfulResponse(res, "Lấy danh sách đội bóng thành công!", HttpStatusCode.OK, { data })
    })
  }

  static async kickMember(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await TeamController.kickMember(req.params.id, req.body.member)
      return ResponseHelper.successfulResponse(res, "Kick thành viên khỏi đội bóng thành công!", HttpStatusCode.OK, {
        data
      })
    })
  }
}

export default TeamRoutes
