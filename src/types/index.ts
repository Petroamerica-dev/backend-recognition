import { Request } from 'express';

export type ValueType = "EFICIENCIA" | "LIDERAZGO" | "TRABAJO EN EQUIPO"

export interface AuthRequest extends Request {
    user?: {
        userId: number;
        email: string;
        name: string;
        bossId: number;
    };
}

export interface Usuario {
    ID_USUARIO: number;
    CORREO: string;
    NOMBRE: string;
    ID_JEFE: number;
}

export interface Valor {
    ID_VALOR: number;
    NOMBRE: string;
    DESCRIPCION_CORTA: string;
    DESCRIPCION: string;
}

export interface Comportamiento {
    ID_COMPORTAMIENTO: number;
    ID_VALOR: number;
    DESCRIPCION: string;
    TEXTO_SUGERENCIA: string;
    CUANDO_APLICA: string;
    FLAG_ACTIVO: number;
}

export interface Reconocimiento {
    ID_RECONOCIMIENTO: number;
    ID_USUARIO_ENVIA: number;
    ID_USUARIO_RECIBE: number;
    ID_COMPORTAMIENTO: number;
    MENSAJE: string;
    FECHA_RECONOCIMIENTO: string;
    ESTADO_CORREO: string;
}

export interface User {
    userId: number;
    email: string;
    name: string;
    bossId: number;
}

export interface Value {
    valueId: number;
    name: ValueType;
    shortDescription: string;
    description: string;
}

export interface Behavior {
    behaviorId: number;
    valueId: number;
    description: string;
    suggestionText: string;
    whenApplied: string;
    active: boolean;
}

export interface Recognition {
    recognitionId: number;
    senderId: number;
    receiverId: number;
    behaviorId: number;
    message: string;
    recognitionDate: string;
    emailStatus: string;
}


export interface UserDataResponse {
    "@odata.context": string,
    "businessPhones": string[],
    "displayName": string,
    "givenName": string,
    "jobTitle": string,
    "mail": string,
    "mobilePhone": string,
    "officeLocation": string,
    "preferredLanguage": string,
    "surname": string,
    "userPrincipalName": string,
    "id": string
}

export interface ValueResponse extends Value {
    behaviors: Behavior[];
}


export interface EmailData {
    to: string;
    copy?: string;
    recognition: string;
    comentary: string;
}