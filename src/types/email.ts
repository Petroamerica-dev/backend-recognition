import { CreateRecognitionDTO } from "./recognition";

export interface EmailData {
    to: string;
    html: string;
    copy?: string;
}

export interface EmailSendingRequest extends CreateRecognitionDTO {
    recognition_id: number;
}

export interface PendingEmail {
    recognition_id: number,
    message: string,
    sender_name: string,
    sender_email: string,
    receiver_name: string,
    receiver_email: string,
    behavior_description: string,
    core_value_name: string,
    receiver_id: number,
    copy?: string
}