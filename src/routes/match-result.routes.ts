import { Router } from "express"
import { IRouter } from "../interface"

class MatchResultRoutes implements IRouter {
  readonly path: string = "/match-result"
  readonly router: Router = Router()

  private readonly PATHS = {
    ROOT: this.path
  }
  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {}
}

export default MatchResultRoutes
