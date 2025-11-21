import nodemailer from 'nodemailer'
import { OUTLOOK_EMAIL, OUTLOOK_PASSWORD } from '../config/env';
import { EmailData } from '../types/email';

export class EmailService {
    private transporter: nodemailer.Transporter | null = null;

    constructor() {
        this.initializeMailer();
    }

    private initializeMailer() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp-mail.outlook.com',
            port: 25,
            secure: false,
            auth: {
                user: OUTLOOK_EMAIL,
                pass: OUTLOOK_PASSWORD
            },
            // tls: {
            //     ciphers: 'SSLv3'
            // }
        });
    }

    async sendRecognitionEmail(emailData: EmailData): Promise<boolean> {
        try {
            const mailOptions = {
                from: OUTLOOK_EMAIL,
                to: emailData.to,
                cc: emailData.copy,
                subject: '¡Has recibido un reconocimiento por tu trabajo!',
                html: emailData.html
            }

            await this.transporter?.sendMail(mailOptions);
            console.log('✅ Email enviado correctamente a:', emailData.to);
            return true;
        } catch (error) {
            console.error('Error al enviar correo electrónico:', error);
            return false;
        }
    }
}

export const emailService = new EmailService();