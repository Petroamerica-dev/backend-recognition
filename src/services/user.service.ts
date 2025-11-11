import { UserRepository } from "../repositories/user.repository";
import { User, UserWithDetails } from "../types/user";
import { AppError } from "../utils/errors";

export class UserService {
    constructor(private userRepository: UserRepository) { }

    async getAllUsers(): Promise<UserWithDetails[]> {
        return await this.userRepository.findAll();
    }

    async getUserById(user_id: number): Promise<User | null> {
        const user = await this.userRepository.findById(user_id);
        if(!user){
            throw new AppError('Usuario no encontrado', 404);
        }
        return user;
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const user = await this.userRepository.findByEmail(email);
        if(!user){
            throw new AppError('Usuario no encontrado', 404);
        }
        return user;
    }

    async getBossBySubordinateId(subordinateId: number): Promise<User | null> {
        const subordinate = await this.userRepository.findById(subordinateId);
        if (!subordinate) {
            throw new AppError('Subordinado no encontrado', 404);
        }

        const boss = await this.userRepository.findById(subordinate.boss_id || 0);
        if (!boss) {
            throw new AppError('Jefe no encontrado', 404);
        }

        return boss;
    }

    async searchUser(searchTerm: string, currentPage: number, pageSize: number, excludeUserId: number):Promise<User[]> {
        return await this.userRepository.searchUser(searchTerm, currentPage, pageSize, excludeUserId);
    }
}