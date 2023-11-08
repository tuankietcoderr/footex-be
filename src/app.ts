import cors from "cors"
import express, { Express } from "express"
import mongoose from "mongoose"
import morgan from "morgan"
import { IRouter } from "./interface"

class App {
  public express: Express = express()
  public port: number

  constructor(routes: IRouter[], port: number) {
    this.port = port
    //! THE ORDER OF THESE FUNCTIONS IS IMPORTANT
    this.initializeDatabaseConnection()
    this.initializeMiddleware()
    this.initializeControllers(routes)
  }

  private async initializeDatabaseConnection(): Promise<void> {
    const { MONGODB_URI } = process.env
    try {
      await mongoose.connect(MONGODB_URI!, {
        autoIndex: true
      })
      console.log("MongoDB Connected...")
    } catch (err: any) {
      console.log(err)
      console.error("DB ERR", err.message)
      process.exit(1)
    }
  }

  private initializeMiddleware(): void {
    this.express.use(
      cors({
        origin: "*",
        exposedHeaders: "content-length",
        credentials: true,
        allowedHeaders: [
          "Content-Type",
          "Authorization",
          "Origin",
          "X-Requested-With",
          "Accept",
          "Accept-Encoding",
          "Accept-Language",
          "Host",
          "Referer",
          "User-Agent",
          "X-CSRF-Token"
        ],
        maxAge: 86400,
        preflightContinue: false,
        optionsSuccessStatus: 204
      })
    )
    this.express.use(morgan("combined"))
    this.express.use(express.urlencoded({ extended: true, limit: "50mb" }))
    this.express.use(express.json({ limit: "50mb" }))
    this.express.set("view engine", "ejs")
  }

  private initializeControllers(routes: IRouter[]): void {
    routes.forEach((route: IRouter) => {
      this.express.use("/api", route.router)
    })
  }

  public listen(): void {
    this.express.listen(this.port, () => console.log(`Server listening on port ${this.port}!`))
  }
}

export default App
