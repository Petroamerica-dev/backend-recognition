import { Pool, QueryResult } from "pg";
import { Behavior, BehaviorWithDetail } from "../types/behavior";

export class BehaviorRepository {
    constructor(private pool: Pool) { }

    async findById(behavior_id: number): Promise<Behavior | null> {
        const query = 'SELECT * FROM behaviors WHERE behavior_id = $1';
        const result: QueryResult<Behavior> = await this.pool.query(query, [behavior_id]);
        return result.rows[0] || null;
    }
    async findWithDetails(behavior_id: number): Promise<BehaviorWithDetail | null> {
        const query = `
            SELECT
                b.*,
                cv.name AS core_value_name,
                cv.short_description AS core_value_short_description,
                cv.description AS core_value_description,
                cv.core_value_id
            FROM behaviors b
            JOIN core_values cv ON b.core_value_id = cv.core_value_id
            WHERE b.behavior_id = $1
        `;
        const result: QueryResult<BehaviorWithDetail> = await this.pool.query(query, [behavior_id]);
        return result.rows[0] || null;
    }
}
