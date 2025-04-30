import { Logger } from '@crowbartools/firebot-custom-scripts-types/types/modules/logger';
import axios, { Axios } from "axios";

interface Entity {
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
    public async states(): Promise<Array<Entity>> {
        return (await this.client.get('states')).data.filter((state: Entity) => state.state !== 'unavailable');
    }

    /**
     * Retrieve all available lights
     */
    public async lights(): Promise<Array<Entity>> {
        return (await this.states()).filter((state: Entity) => {
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
}
