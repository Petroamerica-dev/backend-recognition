import { Pool, QueryResult } from "pg";
import { CreateRecognitionDTO, Recognition, RecognitionWithDetail, UpdateRecognitionDTO } from "../types/recognition";

export class RecognitionRepository {

    constructor(private pool: Pool) { }

    async create(recognitionData: CreateRecognitionDTO): Promise<Recognition> {
        const query = `
            INSERT INTO recognitions (sender_id, receiver_id, behavior_id, message)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const values = [
            recognitionData.sender_id,
            recognitionData.receiver_id,
            recognitionData.behavior_id,
            recognitionData.message || null
        ];

        const result: QueryResult<Recognition> = await this.pool.query(query, values);
        return result.rows[0];
    };

    async update(recognitionId: number, recognitionData: UpdateRecognitionDTO): Promise<Recognition | null> {
        const fields: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        if (recognitionData.behavior_id !== undefined) {
            fields.push(`behavior_id = $${paramCount++}`);
            values.push(recognitionData.behavior_id)
        }

        if (recognitionData.sent_at !== undefined) {
            fields.push(`sent_at = $${paramCount++}`);
            values.push(recognitionData.sent_at)
        }

        if (recognitionData.status !== undefined) {
            fields.push(`status = $${paramCount++}`);
            values.push(recognitionData.status)
        }

        if (recognitionData.message !== undefined) {
            fields.push(`message = $${paramCount++}`);
            values.push(recognitionData.message)
        }

        if (fields.length === 0) {
            return await this.findById(recognitionId)
        }

        values.push(recognitionId);

        const query = `
            UPDATE recognitions
            SET ${fields.join(', ')}
            WHERE recognition_id = $${paramCount}
            RETURNING *;
        `;

        const result: QueryResult<Recognition> = await this.pool.query(query, values);
        return result.rows[0] || null;
    }

    async findAll(): Promise<RecognitionWithDetail[]> {
        const query = `
            SELECT 
                recognition_id,
                created_at,
                sent_at,
                status,
                message,
                sender_id,
                sender_name,
                sender_email,
                sender_area,
                receiver_id,
                receiver_name,
                receiver_email,
                receiver_area,
                behavior_description,
                core_value_name,
                core_value_description
            FROM v_recognitions_full
        `
        const result: QueryResult<RecognitionWithDetail> = await this.pool.query(query);
        return result.rows;
    }

    async findByUserId(user_id: number): Promise<RecognitionWithDetail[]> {
        const query = `
            SELECT 
                recognition_id,
                created_at,
                sent_at,
                status,
                message,
                sender_id,
                sender_name,
                sender_email,
                sender_area,
                receiver_id,
                receiver_name,
                receiver_email,
                receiver_area,
                behavior_description,
                core_value_name,
                core_value_description
            FROM v_recognitions_full
            WHERE receiver_id = $1
        `;
        const result: QueryResult<RecognitionWithDetail> = await this.pool.query(query, [user_id]);
        return result.rows;
    }

    async findById(recognitionId: number): Promise<Recognition | null> {
        const query = 'SELECT * FROM recognitions WHERE recognition_id = $1';
        const result: QueryResult<Recognition> = await this.pool.query(query, [recognitionId]);
        return result.rows[0] || null;
    }
}