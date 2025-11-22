import { Response, Request } from 'express';
import { userService, recognitionService, behaviorService } from '../config/instances';
import { EmailService } from '../services/email.service';
import { EmailSendingRequest } from '../types/email';
import { buildEmail } from '../utils/email';

export class EmailController {

    constructor(private emailService: EmailService) { }

    sendEmail = async (req: Request, res: Response): Promise<void> => {
        try {
            const emailData: EmailSendingRequest = req.body;

            let copy = ''

            const sender = await userService.getUserById(emailData.sender_id);
            const receiver = await userService.getUserById(emailData.receiver_id);
            const behavior = await behaviorService.getBehaviorWithDetails(emailData.behavior_id);

            if (!sender || !receiver || !behavior) {
                throw new Error('Emisor, receptor y comportamiento son obligatorios');
            }

            const boss = await userService.getBossBySubordinateId(emailData.receiver_id);

            if (boss) {
                if (boss.email !== sender.email) {
                    copy = boss.email;
                }
            }

            const html = buildEmail({
                behavior: {
                    core_value_name: behavior.core_value_name,
                    description: behavior.description
                },
                senderName: sender.name,
                message: emailData.message
            })

            const email = await this.emailService.sendRecognitionEmail({
                to: receiver.email,
                copy,
                html,
            });

            if (email) {
                await recognitionService.udpateRecognition(emailData.recognition_id, { status: 'enviado', sent_at: new Date() });
                res.json({ success: email });
            } else {
                await recognitionService.udpateRecognition(emailData.recognition_id, { status: 'error' });
                throw new Error('Error al enviar correo electrónico');
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al enviar correo electrónico' });
        }
    };

    getPendingEmails = async (req: Request, res: Response): Promise<any> => {
        try {
            const result = [];
            const emails = await recognitionService.getPendingRecognitions();
            emails.map(e => {
                let copy = ''

                const boss = userService.getBossBySubordinateId(e.receiver_id);
                const html = buildEmail({
                    behavior: {
                        core_value_name: e.core_value_name,
                        description: e.behavior_description
                    },
                    senderName: e.sender_name,
                    message: e.message
                })
                const email = {
                    to: e.receiver_email,
                    html,
                    copy: e.sender_email
                }
                result.push(email);
            })
            res.json(emails);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener emails pendientes' });
        }
    }
}