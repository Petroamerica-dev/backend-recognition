import { Request, Response } from 'express';
import { UserService } from "../services/user.service";

export class UserController {
    constructor(private userService: UserService) { }

    getAllUsers = async (req: Request, res: Response): Promise<void> => {
        const users = await this.userService.getAllUsers();
        res.status(200).json(users);
    };

    getUserById = async (req: Request, res: Response): Promise<void> => {
        const user_id = parseInt(req.params.id);
        const user = await this.userService.getUserById(user_id);

        res.status(200).json(user);
    };

    getUserByEmail = async (req: Request, res: Response): Promise<void> => {
        const  email = req.params.email;
        const user = await this.userService.getUserByEmail(email);
        res.status(200).json(user);
    };

    searchUsers = async (req: Request, res: Response): Promise<void> => {
        const {
            searchTerm,
            currentPage,
            pageSize
        } = req.query;
        const users = await this.userService.searchUser(searchTerm as string,  Number(currentPage), Number(pageSize));

        res.status(200).json(users);
    };
}