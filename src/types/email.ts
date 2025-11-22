import { CreateRecognitionDTO } from "./recognition";

export interface EmailData {
    to: string;
    html: string;
    copy?: string;
}

export interface EmailSendingRequest extends CreateRecognitionDTO {
    recognition_id: number;
}

export interface PendingEmail extends EmailData {
    recognition_id: number;
}