import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { log } from "console";

export default class SiteController extends BaseController {
  constructor() {
    super();
  }

  public async index(req: Request, res: Response): Promise<void> {
    try {
      res.render("home");
    } catch (error) {
      log(error);
      return this.sendError(res, 500, "Internal Server Error!");
    }
  }
}
