import { CoreValueRepository } from "../repositories/core_value.repository";
import { CoreValeWithBehaviors } from "../types/core_value";

export class CoreValueService {
    constructor(private coreValueRepository: CoreValueRepository) { }

    async getAllCoreValues(): Promise<CoreValeWithBehaviors[]>{
        return await this.coreValueRepository.findAll();
    }
}