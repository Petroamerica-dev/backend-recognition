import { pool } from './db';
import { UserRepository } from '../repositories/user.repository';
import { UserService } from '../services/user.service';
import { UserController } from '../controllers/user.controller';
import { CoreValueRepository } from '../repositories/core_value.repository';
import { CoreValueService } from '../services/core_value.service';
import { CoreValueController } from '../controllers/core_value.controller';
import { BehaviorRepository } from '../repositories/behavior.repository';
import { BehaviorService } from '../services/behavior.service';
import { RecognitionRepository } from '../repositories/recognition.repository';
import { RecognitionService } from '../services/recognition.service';
import { RecognitionController } from '../controllers/recognition.controller';
import { EmailService } from '../services/email.service';
import { EmailController } from '../controllers/email.controller';

const userRepository = new UserRepository(pool);
export const userService = new UserService(userRepository);
export const userController = new UserController(userService);


const coreValueRepository = new CoreValueRepository(pool);
export const coreValueService = new CoreValueService(coreValueRepository);
export const coreValueController = new CoreValueController(coreValueService);

const behaviorRepository = new BehaviorRepository(pool);
export const behaviorService = new BehaviorService(behaviorRepository);

const recognitionRepository = new RecognitionRepository(pool);
export const recognitionService = new RecognitionService(recognitionRepository);
export const recognitionController = new RecognitionController(recognitionService);

export const emailService = new EmailService();
export const emailController = new EmailController(emailService);