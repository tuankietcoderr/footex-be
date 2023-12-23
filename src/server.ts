import { configDotenv } from "dotenv"
configDotenv()

import App from "./app"
import { IRouter } from "./interface"
import {
  AdminRoutes,
  BranchRoutes,
  CardFineRoutes,
  FieldBookedQueueRoutes,
  FieldRoutes,
  GoalDetailRoutes,
  GuestRoutes,
  InvitementRoutes,
  MatchRoutes,
  OwnerRoutes,
  PrizeRoutes,
  RateRoutes,
  ReportRoutes,
  TeamRoutes,
  TournamentRoutes
} from "./routes"

const routes: IRouter[] = [
  new AdminRoutes(),
  new GuestRoutes(),
  new OwnerRoutes(),
  new BranchRoutes(),
  new FieldRoutes(),
  new FieldBookedQueueRoutes(),
  new InvitementRoutes(),
  new TeamRoutes(),
  new TournamentRoutes(),
  new PrizeRoutes(),
  new RateRoutes(),
  new MatchRoutes(),
  new GoalDetailRoutes(),
  new CardFineRoutes(),
  new ReportRoutes()
]

const app = new App(routes, Number(process.env.PORT || 2003))

app.listen()
