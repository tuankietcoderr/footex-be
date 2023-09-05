function config(express: any) {
  const app = express();
  const dotenv = require("dotenv");
  const cors = require("cors");
  const bodyParser = require("body-parser");
  const morgan = require("morgan");
  dotenv.config();
  app.use(
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
        "X-CSRF-Token",
      ],
      maxAge: 86400,
      preflightContinue: false,
      optionsSuccessStatus: 204,
    })
  );

  app.use(morgan("combined"));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));
  app.use(
    bodyParser.urlencoded({
      extended: false,
    })
  );

  app.use(bodyParser.json());
  app.use(express.json({ limit: "50mb" }));

  return app;
}

function run(app: any) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}!`));
}

export { config, run };
