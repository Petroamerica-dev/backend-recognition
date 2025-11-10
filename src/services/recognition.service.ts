import { behaviorService, userService } from "../config/instances";
import { RecognitionRepository } from "../repositories/recognition.repository";
import { Recognition } from "../types";
import { CreateRecognitionDTO, UpdateRecognitionDTO } from "../types/recognition";
import { AppError } from "../utils/errors";

export class RecognitionService {
    constructor(private recognitionRepository: RecognitionRepository) { }

    async createRecognition(recognitionData: CreateRecognitionDTO): Promise<Recognition> {
        const sender = userService.getUserById(recognitionData.sender_id)
        const receiver = userService.getUserById(recognitionData.receiver_id);
        const behavior = behaviorService.getBehaviorById(recognitionData.behavior_id);

        if (!sender || !receiver || !behavior) {
            throw new AppError('Los campos emisor, receptor y comportamiento son obligatorios', 400);
        }

        return await this.recognitionRepository.create(recognitionData);
    }

    async udpateRecognition(recognitionId: number, recognitionData: UpdateRecognitionDTO): Promise<Recognition> {
        const existingRecognition = this.recognitionRepository.findById(recognitionId);

        if(!existingRecognition) {
            throw new AppError('Reconocimiento no encontrado', 404);
        }

        const updatedRecognition = await this.recognitionRepository.update(recognitionId, recognitionData);

        if(!updatedRecognition) {
            throw new AppError('Error al actualizar el reconocimiento', 500);
        }

        return updatedRecognition;
    }
}