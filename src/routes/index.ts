import { Express } from "express"
import rootRouter from "../routes/root"
import authRouter from "../routes/auth"
import guestRouter from "../routes/guest"
import inviteRouter from "../routes/invite"
import organizationRouter from "../routes/organization"
import fieldRouter from "../routes/field"
import tournamentRouter from "../routes/tournament"

function getRoutes(app: Express) {
  app.use("/", rootRouter)
  app.use("/api/user/", authRouter)
  app.use("/api/guest/", guestRouter)
  app.use("/api/invite/", inviteRouter)
  app.use("/api/organization/", organizationRouter)
  app.use("/api/field/", fieldRouter)
  app.use("/api/tournament/", tournamentRouter)
}

export default getRoutes
