import { configDotenv } from "dotenv"
configDotenv()

import App from "./app"
import { IRouter } from "./interface"
import { AdminRoutes, BranchRoutes, FieldBookedQueueRoutes, FieldRoutes, GuestRoutes, OwnerRoutes } from "./routes"

const routes: IRouter[] = [
  new AdminRoutes(),
  new GuestRoutes(),
  new OwnerRoutes(),
  new BranchRoutes(),
  new FieldRoutes(),
  new FieldBookedQueueRoutes()
]

const app = new App(routes, Number(process.env.PORT || 2003))

app.listen()
