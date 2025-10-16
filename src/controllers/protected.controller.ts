import { Response } from 'express';
import { AuthRequest, Behavior, Value } from '../types';
import { excelService } from '../services/excel.service';
import { emailService } from '../services/email.service';

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const user = await excelService.getUserById(req.params.userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);

        res.status(500).json({ error: 'Error al obtener perfil' });
    }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
    try {
        const users = await excelService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

export const searchUser = async (req: AuthRequest, res: Response) => {
    try {
        const users = await excelService.searchUser(req.query.searchTerm as string, Number(req.query.currentPage || 1), Number(req.query.pageSize || 5));
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar usuarios' });
    }
};

export const getValues = async (req: AuthRequest, res: Response) => {
    try {
        const values = await excelService.getValues();
        const behaviors = await excelService.getBehaviors();

        const valuesResponse = values.map((value: Value) => {
            return {
                ...value,
                name: value.name.toUpperCase(),
                behaviors: behaviors.filter((behavior: Behavior) => behavior.valueId === value.valueId)
            };
        });

        res.json(valuesResponse);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener valores' });
    }
};


export const postRecognition = async (req: AuthRequest, res: Response) => {
    try {
        const { senderId, receiverId, behaviorId, message } = req.body;
        const recognition = await excelService.createRecognition(senderId, receiverId, behaviorId, message);
        res.json(recognition);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear reconocimiento' });
    }
};

export const sendEmail = async (req: AuthRequest, res: Response) => {
    try {
        const { recognitionId, to, copy, recognition, comentary } = req.body;
        const email = await emailService.sendRecognitionEmail({
            to,
            copy,
            recognition,
            comentary
        });

        if (email) {
            await excelService.updateRecognitionEmailStatus(recognitionId, 'ENVIADO');
        } else {
            await excelService.updateRecognitionEmailStatus(recognitionId, 'NO ENVIADO');
            throw new Error('Error al enviar correo electrónico');
        }

        res.json({ success: email });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al enviar correo electrónico' });
    }
};