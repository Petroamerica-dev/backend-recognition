import { Behavior, Comportamiento, Recognition, Reconocimiento, User, Usuario, Valor, Value, ValueType } from "../types";

export const userMapper = (user: Usuario): User => {
    return {
        userId: user.ID_USUARIO,
        email: user.CORREO,
        name: user.NOMBRE,
        bossId: user.ID_JEFE
    };
};

export const valueMapper = (value: Valor): Value => {
    return {
        valueId: value.ID_VALOR,
        name: value.NOMBRE as ValueType,
        shortDescription: value.DESCRIPCION_CORTA,
        description: value.DESCRIPCION
    };
};

export const behaviorMapper = (behavior: Comportamiento): Behavior => {
    return {
        behaviorId: behavior.ID_COMPORTAMIENTO,
        valueId: behavior.ID_VALOR,
        description: behavior.DESCRIPCION,
        suggestionText: behavior.TEXTO_SUGERENCIA,
        whenApplied: behavior.CUANDO_APLICA
    };
};

export const recognitionMapper = (recognition: Reconocimiento): Recognition => {
    return {
        recognitionId: recognition.ID_RECONOCIMIENTO,
        senderId: recognition.ID_USUARIO_ENVIA,
        receiverId: recognition.ID_USUARIO_RECIBE,
        behaviorId: recognition.ID_COMPORTAMIENTO,
        message: recognition.MENSAJE,
        recognitionDate: recognition.FECHA_RECONOCIMIENTO,
        emailStatus: recognition.ESTADO_CORREO
    };
};
