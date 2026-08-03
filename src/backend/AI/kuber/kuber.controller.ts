import { Request, Response } from "express";
import { kuberService } from "./kuber.service";

export class KuberController {

  async research(req: Request, res: Response) {

    const { query } = req.body;

    const result = await kuberService.research(query);

    res.json(result);

  }

}

export const kuberController = new KuberController();