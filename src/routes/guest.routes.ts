import { Router } from "express"
import { IRouter } from "../interface"

class GuestRoutes implements IRouter {
  readonly router: Router = Router()
  readonly path: string = "/guest"

  private readonly PATHS = {
    ROOT: this.path,
    REGISTER_TO_BE_OWNER: `${this.path}/register-to-be-owner`,
    GUEST_TOURNAMENTS: `${this.path}/:id/tournaments`,
    GUEST_MATCHES: `${this.path}/:id/matches`,
    GUEST_MATCHES_MATCH: `${this.path}/:id/matches/:matchId`,
    GUEST_MATCHES_MATCH_GOALS: `${this.path}/:id/matches/:matchId/goals`
  }

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes(): void {}
}

export default GuestRoutes
