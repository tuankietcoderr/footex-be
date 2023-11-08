import { Router } from "express"
import { IRouter } from "../interface"

class PrizeRoutes implements IRouter {
  readonly path: string = "/prize"
  readonly router: Router = Router()

  private readonly PATHS = {
    ROOT: this.path
  }
  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {}
}

export default PrizeRoutes
