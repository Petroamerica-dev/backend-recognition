import nodemailer from 'nodemailer'
// import { OUTLOOK_EMAIL, OUTLOOK_PASSWORD } from '../config/env';
import { EmailData } from '../types/email';

export class EmailService {
    private transporter: nodemailer.Transporter | null = null;

    constructor() {
        this.initializeMailer();
    }

    private initializeMailer() {
        // this.transporter = nodemailer.createTransport({
        //     host: 'smtp-mail.outlook.com',
        //     port: 587,
        //     secure: false,
        //     auth: {
        //         user: OUTLOOK_EMAIL,
        //         pass: OUTLOOK_PASSWORD
        //     },
        //     tls: {
        //         ciphers: 'SSLv3'
        //     }
        // });
    }

    async sendRecognitionEmail(): Promise<boolean> {
        try {
            await new Promise((resolve) => setTimeout(resolve, 5000));

            return true;
        } catch (error) {
            console.error('Error al enviar correo electrónico:', error);
            return false;
        }
    }
}

export const emailService = new EmailService();