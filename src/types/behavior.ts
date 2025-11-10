export interface Behavior {
    behavior_id: number;
    core_value_id: number;
    description: string;
    suggestion_text: string;
    when_applied: string;
    is_deleted: boolean;
    created_at: Date;
}

export interface BehaviorWithDetail extends Behavior{
    core_value_name: string;
    core_value_description: string;
    core_value_short_description: string;
    core_value_id: number;
}