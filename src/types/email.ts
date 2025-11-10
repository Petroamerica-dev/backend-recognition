import { CoreValueType } from ".";
import { CreateRecognitionDTO } from "./recognition";

export interface EmailData {
    to: string;
    copy?: string;
    recognition: CoreValueType;
    message?: string;
}

export interface EmailSendingRequest extends CreateRecognitionDTO {
    recognition_id: number;
}