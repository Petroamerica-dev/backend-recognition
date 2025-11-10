import { Request, Response } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_REFRESH_SECRET, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, AZURE_REDIRECT_URI, AZURE_TENANT } from '../config/env';
import { userService } from '../config/instances';

export class AuthController {
    constructor() { }

    login = (_: Request, res: Response) => {
        const authUrl = `https://login.microsoftonline.com/${AZURE_TENANT}/oauth2/v2.0/authorize?` +
            `client_id=${AZURE_CLIENT_ID}` +
            `&response_type=code` +
            `&redirect_uri=${encodeURIComponent(AZURE_REDIRECT_URI || '')}` +
            `&response_mode=query` +
            `&scope=openid%20profile%20email%20User.Read` +
            `&state=${Math.random().toString(36).substring(7)}`;

        res.json({ authUrl });
    };

    callback = async (req: Request, res: Response) => {
        const { code } = req.query;
        const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4504';

        if (!code) {
            return res.redirect(`${FRONTEND_URL}/reconocimiento/login?error=no_code`);
        }

        try {
            const tokenResponse = await axios.post(
                `https://login.microsoftonline.com/${AZURE_TENANT}/oauth2/v2.0/token`,
                new URLSearchParams({
                    client_id: AZURE_CLIENT_ID || '',
                    client_secret: AZURE_CLIENT_SECRET || '',
                    code: code as string,
                    redirect_uri: AZURE_REDIRECT_URI || '',
                    grant_type: 'authorization_code',
                }),
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }
            );

            const { access_token } = tokenResponse.data;

            const userResponse = await axios.get('https://graph.microsoft.com/v1.0/me', {
                headers: { Authorization: `Bearer ${access_token}` }
            });

            const { mail, userPrincipalName } = userResponse.data;
            const userEmail = mail || userPrincipalName;

            const user = await userService.getUserByEmail(userEmail);

            if (!user) {
                return res.redirect(`${FRONTEND_URL}/reconocimiento/login?error=unauthorized`);
            }

            const accessToken = jwt.sign(
                {
                    user_id: user.user_id,
                    email: userEmail,
                    name: user.name,
                    boss_id: user.boss_id
                },
                JWT_SECRET || '',
                { expiresIn: '15m' }
            );

            const refreshToken = jwt.sign(
                { user_id: user.user_id, email: userEmail },
                JWT_REFRESH_SECRET || '',
                { expiresIn: '7d' }
            );

            const authData = Buffer.from(JSON.stringify({
                accessToken,
                refreshToken,
                user: {
                    user_id: user.user_id,
                    email: userEmail,
                    name: user.name,
                    boss_id: user.boss_id
                }
            })).toString('base64');

            res.redirect(`${FRONTEND_URL}/reconocimiento/auth/callback?token=${authData}`);

        } catch (error: any) {
            console.error('Error en callback:', error.response?.data || error.message);
            res.redirect(`${FRONTEND_URL}/reconocimiento/login?error=auth_failed`);
        }
    };

    refresh = async (req: Request, res: Response) => {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token requerido' });
        }

        try {
            const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET || "") as any;

            const usuario = await userService.getUserByEmail(decoded.email);

            if (!usuario) {
                return res.status(403).json({ error: 'Usuario no encontrado' });
            }

            const accessToken = jwt.sign(
                {
                    user_id: usuario.user_id,
                    email: decoded.email,
                    name: usuario.name,
                    boss_id: usuario.boss_id
                },
                JWT_SECRET || "",
                { expiresIn: '15m' }
            );

            res.json({ accessToken });

        } catch (error) {
            res.status(401).json({ error: 'Refresh token inválido o expirado' });
        }
    };

    logout = (req: Request, res: Response) => {
        res.json({ message: 'Logout exitoso' });
    };
}