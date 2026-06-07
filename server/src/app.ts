import dotenv from "dotenv";
import express, { Application } from "express";
import path from "path";
import routes from "./routes/index";
import cors from "cors";
import { engine } from "express-handlebars";
import morgan from "morgan";
import cookieParser from "cookie-parser";
const envFile = process.env.NODE_ENV === "development" ? ".env.local" : ".env";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

class App {
  private app: Application;

  constructor() {
    this.app = express();
    this.configureMiddlewares();
    this.initializeRoutes();
  }

  private configureMiddlewares(): void {
    this.app.use(cors({
      origin: process.env.URL_CLIENT || "http://localhost:5173",
      credentials: true,
      optionsSuccessStatus: 200,
    }));
    this.app.use(cookieParser()); 
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static(path.join(process.cwd(), "public")));

    if (process.env.NODE_ENV === "development") {
      this.app.use(morgan("dev"));
    }

    this.app.engine("hbs", engine({
      extname: ".hbs",
      helpers: {
        sum: (a: number, b: number) => a + b,
      },
    }));
    this.app.set("view engine", "hbs");
    this.app.set("views", path.join(process.cwd(), "src", "resources", "views"));
  }

  private initializeRoutes(): void {
    this.app.use(routes);
  }

  public getApp(): Application {
    return this.app;
  }
}

export default new App().getApp();
