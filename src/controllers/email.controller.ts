import { Response, Request } from 'express';
import { userService, recognitionService, behaviorService } from '../config/instances';
import { EmailService } from '../services/email.service';
import { EmailSendingRequest, PendingEmail } from '../types/email';
import { buildEmail } from '../utils/email';

export class EmailController {

    constructor(private emailService: EmailService) { }

    sendEmail = async (req: Request, res: Response): Promise<void> => {
        try {
            const email = await this.emailService.sendRecognitionEmail();

            if (email) {
                res.json({ success: email });
            } else {
                throw new Error('Error al enviar correo electrónico');
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al enviar correo electrónico' });
        }
    };

    getPendingRecognitions = async (req: Request, res: Response): Promise<void> => {
        try {
            const result: PendingEmail[] = [];
            const emails = await recognitionService.getPendingRecognitions();
            emails.map(e => {
                const html = buildEmail({
                    behavior: {
                        core_value_name: e.core_value_name,
                        description: e.behavior_description
                    },
                    senderName: e.sender_name,
                    message: e.message
                })
                result.push({
                    html,
                    recognition_id: e.recognition_id,
                    to: e.receiver_email,
                    copy: e.copy
                });
            })
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener emails pendientes' });
        }
    }
}