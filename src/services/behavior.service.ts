import { BehaviorRepository } from "../repositories/behavior.repository";
import { Behavior, BehaviorWithDetail } from "../types/behavior";

export class BehaviorService {
    constructor(private behaviorRepository: BehaviorRepository) { }

    async getBehaviorById(behaviorId: number): Promise<Behavior | null> {
        return await this.behaviorRepository.findById(behaviorId);
    }

    async getBehaviorWithDetails(behaviorId: number): Promise<BehaviorWithDetail | null> {
        return await this.behaviorRepository.findWithDetails(behaviorId);
    }
}