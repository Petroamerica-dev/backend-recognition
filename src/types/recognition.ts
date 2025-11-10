export type RecognitionStatus = 'pendiente' | 'enviado' | 'error'

export interface Recognition {
    recognition_id: number;
    sender_id: number;
    receiver_id: number;
    behavior_id: number;
    message?: string;
    status: RecognitionStatus;
    sent_at: Date;
    created_at: Date;
    updated_at: Date;
}

export interface CreateRecognitionDTO {
    sender_id: number;
    receiver_id: number;
    behavior_id: number;
    message?: string;
}


export interface UpdateRecognitionDTO {
    behavior_id?: number;
    message?: string;
    status?: RecognitionStatus;
    sent_at?: Date;
}

export interface RecognitionWithDetail {
    recognition_id: number;
    created_at: Date;
    sent_at: string;
    status: RecognitionStatus;
    message: string;
    sender_id: number;
    sender_name: string;
    sender_email: string;
    sender_area: string;
    receiver_id: number;
    receiver_name: string;
    receiver_email: string;
    receiver_area: string;
    behavior_description: string;
    core_value_name: string;
    core_value_description: string;
}