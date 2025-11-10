import { BehaviorWithDetail } from "../types/behavior";

interface EmailContentParams {
    behavior: BehaviorWithDetail;
    message?: string;
    senderName: string;
}

export const buildEmail = (params: EmailContentParams) => {
    const core_value = params.behavior.core_value_name;
    let title = '';
    let color = '';
    let imgHref = '';
    switch (core_value.toUpperCase()) {
        case 'LIDERAZGO':
            title = '¡Tu liderazgo inspira a todos!';
            color = '#0078d4';
            imgHref = 'https://res.cloudinary.com/dcxg13hqx/image/upload/v1762796840/petroamerica/leadership_veltzk.png'
            break;
        case 'TRABAJO EN EQUIPO':
            title = '¡Tu espíritu de equipo nos une!';
            color = '#20943f'
            imgHref = 'https://res.cloudinary.com/dcxg13hqx/image/upload/v1762796891/petroamerica/team-work-removebg-preview_vxoshq.png'
            break;
        case 'EFICIENCIA':
            title = '¡Tu eficiencia marca la diferencia!';
            color = '#ecbf0a';
            imgHref = 'https://res.cloudinary.com/dcxg13hqx/image/upload/v1762796840/petroamerica/eficience_ayjnck.png'
            break;
        default:
            title = '';
            color = '';
            imgHref = '';
            break;
    }


    return (` <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${color}; font-size: 27px;">${title}</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #323130;">Por que cuando colaboramos logramos más.</p>
        ${params.message ? 
            `<p style="font-size: 16px; line-height: 1.6; color: #323130;">${params.senderName}:</p> <p style="font-size: 15px; line-height: 1.6; color: #353434;">"${params.message}"</p>`: 
            `<p style="font-size: 16px; line-height: 1.6; color: #323130;">${params.senderName} quizo reconocer tu aporte por ${core_value}.</p>`
        }
        <div style="width: fit-content;padding: 7px 15px; background-color: ${color}; border-radius: 5px; margin: 20px 0; color: white;">
            <h3 style="font-size: 18px;  margin: 5px 0 0 0;">
                <span style="color: #fff; font-weight: normal;">Motivo: </span>${core_value}
            </h3>
        </div>
        <p style="color: #323130; font-size: 15px;">
        ${params.behavior.description}
        </p>
        <div style="width: fit-content; float: right;">
            <img src="${imgHref}"  alt="" width="225">
        </div>
            <p style="color: #8b8b8b; font-size: 14px; margin: 0;">
            En Petroamérica celebramos el esfuerzo compartido que construye confianza.
            </p>
        </div>
    `)
}