import { Router } from "express"
import { IRouter } from "../interface"

class RateRoutes implements IRouter {
  readonly path: string = "/rate"
  readonly router: Router = Router()

  private readonly PATHS = {
    ROOT: this.path
  }
  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {}
}

export default RateRoutes
