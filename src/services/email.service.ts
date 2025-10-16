import nodemailer from 'nodemailer'
import { OUTLOOK_EMAIL, OUTLOOK_PASSWORD } from '../config';
import { EmailData } from '../types';

class EmailService {
    private transporter: nodemailer.Transporter | null = null;

    constructor() {
        this.initializeMailer();
    }

    private initializeMailer() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp-mail.outlook.com',
            port: 587,
            secure: false,
            auth: {
                user: OUTLOOK_EMAIL,
                pass: OUTLOOK_PASSWORD
            },
            tls: {
                ciphers: 'SSLv3'
            }
        });
    }

    async sendRecognitionEmail(emailData: EmailData): Promise<boolean> {
        try {
            const mailOptions = {
                from: OUTLOOK_EMAIL,
                to: emailData.to,
                cc: emailData.copy,
                subject: '🎉 Has recibido un reconocimiento',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #0078d4;">¡Felicidades! Has recibido un reconocimiento</h2>
                        <div style="background-color: #f3f2f1; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <p style="font-size: 16px; line-height: 1.6; color: #323130;">
                                ${emailData.recognition}
                            </p>
                        </div>
                            <p style="font-size: 14px; line-height: 1.6; color: #ccc;">
                                ${emailData.comentary}
                            </p>
                        <p style="color: #605e5c; font-size: 14px;">
                            Sigue así, tu trabajo es valorado por el equipo.
                        </p>
                    </div>
                `
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