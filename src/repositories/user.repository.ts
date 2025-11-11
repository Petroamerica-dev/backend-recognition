import { Pool, QueryResult } from 'pg'
import { UserWithDetails, User } from '../types/user';


export class UserRepository {
    constructor(private pool: Pool) { }

    async findAll(): Promise<UserWithDetails[]> {
        const query = `
        SELECT
            u.user_id,
            u.name,
            u.email,
            a.name AS area_name,
            b.name AS boss_name
        FROM users u
        LEFT JOIN areas a ON u.area_id = a.area_id
        LEFT JOIN users b ON u.boss_id = b.user_id
        WHERE u.is_active = true
        ORDER BY u.created_at DESC
        `;

        const result: QueryResult<UserWithDetails> = await this.pool.query(query);
        return result.rows;
    }

    async findByEmail(email: string): Promise<User | null> {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result: QueryResult<User> = await this.pool.query(query, [email]);
        return result.rows[0] || null;
    }

    async findById(user_id: number): Promise<User | null> {
        const query = 'SELECT * FROM users WHERE user_id = $1';
        const result: QueryResult<User> = await this.pool.query(query, [user_id]);
        return result.rows[0] || null;
    }

  async searchUser(searchTerm: string, currentPage: number, pageSize: number, excludeUserId: number): Promise<User[]> {
    const offset = (currentPage - 1) * pageSize;
    const query = `
        SELECT *
        FROM users
        WHERE (name ILIKE $1 OR email ILIKE $1)
        AND user_id != $2
        ORDER BY name
        LIMIT $3 OFFSET $4
    `;
    const values = [`%${searchTerm}%`, excludeUserId, pageSize, offset];

    const result: QueryResult<User> = await this.pool.query(query, values);
    return result.rows;
}
}