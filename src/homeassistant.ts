import { Logger } from '@crowbartools/firebot-custom-scripts-types/types/modules/logger';
import axios, { Axios } from "axios";

interface EffectType {
    entity_id: string,
    brightness_pct?: number,
    rgb_color?: Array<number>
}

export interface HaEntity {
    entity_id: string,
    state: string,
    attributes: {
        friendly_name: string,
    },

    last_changed: string,
    last_reported: string,
    last_updated: string,
}

export class HomeAssistantAPI {

    private static instance: HomeAssistantAPI;
    private client: Axios;
    private logger: Logger;

    /**
     * Retrieve instance of this class
     * 
     * @returns HomeAssistantAPI
     */
    public static make(): HomeAssistantAPI {
        if (!(HomeAssistantAPI.instance instanceof HomeAssistantAPI)) {
            HomeAssistantAPI.instance = new HomeAssistantAPI();
        }
        return HomeAssistantAPI.instance;
    }

    public setLogger(logger: Logger) {
        this.logger = logger;
    }

    public setCredentials(url: string, token: string) {
        this.client = axios.create({
            baseURL: url + '/api',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });
    }

    /**
     * Retrieve all states, but filter out unavailable entities
     */
    public async states(): Promise<Array<HaEntity>> {
        return (await this.client.get('states')).data.filter((state: HaEntity) => state.state !== 'unavailable');
    }

    /**
     * Retrieve all available lights
     */
    public async lights(): Promise<Array<HaEntity>> {
        return (await this.states()).filter((state: HaEntity) => {
            return state.entity_id.startsWith('light.');
        });
    }

    /**
     * Toggles a light with the given entity_id
     */
    public async toggleLight(entity_id: string) {
        this.client.post('services/light/toggle', {
            'entity_id': entity_id
        });
    }

    public controlLight(effect: any) {
        this.logger.info('Received effect for controlling light', effect);

        let effectData: EffectType = {'entity_id': effect.lightId};
        let service = 'turn_on';
        switch(effect.activationAction) {
            case 'on': {
                service = 'turn_on';
                break;
            }
            case 'off': {
                service = 'turn_off';
                break;
            }
            case 'toggle': {
                service = 'toggle';
                break;
            }
        }

        if (effect.updateBrightness) {
            effectData.brightness_pct = effect.brightnessPercentage;
        }

        if (effect.updateColor && effect.color) {
            // extract colors from the hex code
            let allcolors = parseInt(/^#?([a-f\d]{6})$/i.exec(effect.color)[1], 16);
            let r = (allcolors >> 16) & 255,
                g = (allcolors >> 8) & 255,
                b = allcolors & 255;

            effectData.rgb_color  = [r, g, b];
        }
        
        this.client.post('services/light/' + service, effectData);
    }

    public controlSwitch(effect: any) {
        this.logger.info('Received effect for controlling switch', effect);
        let service = 'turn_on';
        switch(effect.activationAction) {
            case 'on': {
                service = 'turn_on';
                break;
            }
            case 'off': {
                service = 'turn_off';
                break;
            }
            case 'toggle': {
                service = 'toggle';
                break;
            }
        }
        
        this.client.post('services/switch/' + service, {'entity_id': effect.entity_id});
    }

    public runScript(effect: any) {
        this.logger.info('Received effect for running script', effect);        
        this.client.post('services/script/turn_on', {'entity_id': effect.entity_id});
    }
    
    public applyScene(effect: any) {
        this.logger.info('Received effect for applying scene', effect);        
        this.client.post('services/scene/turn_on', {'entity_id': effect.entity_id});
    }
}
