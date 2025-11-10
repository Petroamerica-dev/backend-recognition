import { Response, Request } from 'express';
import { CoreValueType } from '../types';
import { userService, recognitionService, behaviorService } from '../config/instances';
import { EmailService } from '../services/email.service';
import { EmailSendingRequest } from '../types/email';

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

            const email = await this.emailService.sendRecognitionEmail({
                to: receiver.email,
                recognition: behavior.core_value_name as CoreValueType,
                message: emailData.message,
                copy
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
}