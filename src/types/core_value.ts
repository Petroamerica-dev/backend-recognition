import type { Behavior } from "./behavior";

export interface CoreValue {
    core_value_id: number;
    name: string;
    short_description: string;
    description: string;
    is_active: boolean;
    created_at: Date;
}

export interface CoreValeWithBehaviors extends CoreValue {
    behaviors: Behavior[]
}