import { Request, Response } from 'express';
import { RecognitionService } from "../services/recognition.service";
import { CreateRecognitionDTO, UpdateRecognitionDTO } from '../types/recognition';

export class RecognitionController {
    constructor(private recognitionService: RecognitionService) { }

    createRecognition = async (req: Request, res: Response): Promise<void> => {
        const recognitionData: CreateRecognitionDTO = req.body;
        const newRecognition = await this.recognitionService.createRecognition(recognitionData);

        res.status(201).json({
            success: true,
            message: 'Reconocimiento creado exitosamente',
            data: newRecognition
        });
    };

    updateRecognition = async (req: Request, res: Response): Promise<void> => {
        const recognitionId = parseInt(req.params.id);
        const recognitionData: UpdateRecognitionDTO = req.body;

        const updatedRecognition = await this.recognitionService.udpateRecognition(recognitionId, recognitionData);

        res.status(200).json({
            success: true,
            message: 'Reconocimiento actualizado exitosamente',
            data: updatedRecognition
        });
    };
}