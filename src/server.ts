import { configDotenv } from "dotenv"
import App from "./app"
import { IRouter } from "./interface"
import { AuthRoutes } from "./routes"
configDotenv()

const routes: IRouter[] = [new AuthRoutes()]

const app = new App(routes, Number(process.env.PORT || 2003))

app.config()
app.listen()
