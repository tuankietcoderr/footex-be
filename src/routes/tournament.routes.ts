import { Request, Response, Router } from "express"
import { IRouter } from "../interface"
import { HttpStatusCode, ResponseHelper } from "../helper"
import { TournamentController } from "../controllers"
import { AuthMiddleware } from "../middleware"
import { ERole } from "../enum"

class TournamentRoutes implements IRouter {
  readonly path: string = "/tournament"
  readonly router: Router = Router()
  private readonly PATHS = {
    ROOT: this.path,
    ID: `${this.path}/:id`,
    GUEST_JOINT: `${this.path}/joint`,
    TEAM: `${this.path}/team/:teamId`,
    JOIN: `${this.path}/:id/join`
  }

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    this.router.get(this.PATHS.ROOT, TournamentRoutes.getAllTournaments)
    this.router.get(
      this.PATHS.GUEST_JOINT,
      AuthMiddleware.verifyRoles([ERole.GUEST]),
      TournamentRoutes.getGuestJointTournaments
    )
    this.router.post(this.PATHS.ROOT, AuthMiddleware.verifyRoles([ERole.OWNER]), TournamentRoutes.createTournament)
    this.router.put(this.PATHS.ID, AuthMiddleware.verifyRoles([ERole.OWNER]), TournamentRoutes.updateTournamentInfo)
    this.router.delete(
      this.PATHS.TEAM,
      AuthMiddleware.verifyRoles([ERole.OWNER]),
      TournamentRoutes.removeTeamFromTournament
    )
    this.router.get(this.PATHS.ID, TournamentRoutes.getTournamentById)
    this.router.post(this.PATHS.JOIN, AuthMiddleware.verifyRoles([ERole.GUEST]), TournamentRoutes.joinTournament)
  }

  static async getAllTournaments(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await TournamentController.getAll()
      return ResponseHelper.successfulResponse(res, "Lấy danh sách giải đấu thành công!", HttpStatusCode.OK, { data })
    })
  }

  static async getTournamentById(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await TournamentController.getById(req.params.id)
      return ResponseHelper.successfulResponse(res, "Lấy thông tin giải đấu thành công!", HttpStatusCode.OK, { data })
    })
  }

  static async getGuestJointTournaments(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await TournamentController.getGuestJointTournament(req.userId.toString())
      return ResponseHelper.successfulResponse(res, "Lấy danh sách giải đấu thành công!", HttpStatusCode.OK, { data })
    })
  }

  static async createTournament(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await TournamentController.create(req.body)
      return ResponseHelper.successfulResponse(res, "Tạo giải đấu thành công!", HttpStatusCode.CREATED, { data })
    })
  }

  static async updateTournamentInfo(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await TournamentController.updateInfo(req.params.id, req.body)
      return ResponseHelper.successfulResponse(res, "Cập nhật giải đấu thành công!", HttpStatusCode.OK, { data })
    })
  }

  static async removeTeamFromTournament(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await TournamentController.removeTeam(req.params.id, req.body.teamId)
      return ResponseHelper.successfulResponse(res, "Xóa đội bóng thành công!", HttpStatusCode.OK, { data })
    })
  }

  static async joinTournament(req: Request, res: Response) {
    await ResponseHelper.wrapperHandler(res, async () => {
      const { data } = await TournamentController.joinTournament(req.params.id, req.body.teamId)
      return ResponseHelper.successfulResponse(res, "Tham gia giải đấu thành công!", HttpStatusCode.OK, { data })
    })
  }
}

export default TournamentRoutes
