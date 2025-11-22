import { Pool, QueryResult } from "pg";
import { CreateRecognitionDTO, PendingRecognition, Recognition, RecognitionWithDetail, UpdateRecognitionDTO } from "../types/recognition";

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


    async selectPendingRecognitions(): Promise<PendingRecognition[]> {
        const query = `
            SELECT
                r.recognition_id,
                r.message,
                s.name AS sender_name,
                s.email AS sender_email,
                u.name AS receiver_name,
                u.email AS receiver_email,
                b.description AS behavior_description,
                cv.name AS core_value_name,
                u.user_id AS receiver_id,
                CASE 
                    WHEN r.sender_id = u.boss_id THEN NULL 
                    ELSE boss.email 
                END AS copy
            FROM recognitions r
            INNER JOIN users s ON r.sender_id = s.user_id
            INNER JOIN users u ON r.receiver_id = u.user_id
            INNER JOIN behaviors b ON r.behavior_id = b.behavior_id
            INNER JOIN core_values cv ON b.core_value_id = cv.core_value_id
            LEFT JOIN users boss ON u.boss_id = boss.user_id
            WHERE r.status = 'pendiente';
        `;

        const result: QueryResult = await this.pool.query(query);
        return result.rows;
    }
}