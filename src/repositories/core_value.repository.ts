import { Pool, QueryResult } from "pg";
import { CoreValeWithBehaviors } from "../types/core_value";

export class CoreValueRepository {
    constructor(private pool: Pool) { }

    async findAll(): Promise<CoreValeWithBehaviors[]>{
        const query = `
        SELECT
            cv.core_value_id,
            cv.name,
            cv.short_description,
            cv.description,
            cv.created_at,
            json_agg(
                json_build_object(
                    'behavior_id', b.behavior_id,
                    'core_value_id', b.core_value_id,
                    'description', b.description,
                    'suggestion_text', b.suggestion_text,
                    'when_applied', b.when_applied,
                    'is_deleted', b.is_deleted,
                    'created_at', b.created_at
                ) ORDER BY b.behavior_id
            ) FILTER (WHERE b.behavior_id IS NOT NULL) as behaviors
        FROM core_values cv
        LEFT JOIN behaviors b ON cv.core_value_id = b.core_value_id AND b.is_deleted = false
        WHERE cv.is_active = true
        GROUP BY cv.core_value_id
        ORDER BY cv.name
        `;
        const result: QueryResult<CoreValeWithBehaviors> = await this.pool.query(query);
        return result.rows.map(row => ({
            ...row,
            behaviors: row.behaviors || []
        }))
    }
}