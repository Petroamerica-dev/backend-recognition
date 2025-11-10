import { Request, Response } from "express";
import { CoreValueService } from "../services/core_value.service";

export class CoreValueController {
    constructor(private coreValueService: CoreValueService) { }

    getAllCoreValues = async (req: Request, res: Response): Promise<void> => {
        const coreValues = await this.coreValueService.getAllCoreValues();
        res.status(200).json(coreValues)
    }
}