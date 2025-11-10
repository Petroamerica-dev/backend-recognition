import { Request } from 'express';

export type CoreValueType = "Eficiencia" | "Liderazgo" | "Trabajo en Equipo";

export interface AuthRequest extends Request {
    user?: {
        userId: number;
        email: string;
        name: string;
        bossId: number;
    };
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

