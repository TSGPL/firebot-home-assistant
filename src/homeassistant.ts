import { Integration, IntegrationController, IntegrationData, IntegrationDefinition, IntegrationManager, LinkData } from '@crowbartools/firebot-custom-scripts-types/types/modules/integration-manager';
import { RunRequest } from "@crowbartools/firebot-custom-scripts-types";
import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
//import { EventManager, EventSource } from '@crowbartools/firebot-custom-scripts-types/types/modules/event-manager';
//import { EventFilter } from '@crowbartools/firebot-custom-scripts-types/types/modules/event-filter-manager';
//import { EventEmitter } from 'events';
import axios, { Axios } from "axios";
//import { Logger } from '@crowbartools/firebot-custom-scripts-types/types/modules/logger';
//import { ReplaceVariableManager } from '@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager';

class HomeAssistantAPI {

    private client: Axios;

    constructor(url: string, token: string) {
        this.client = axios.create({
            baseURL: url + '/api',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });
    }

    public async states() {
        return (await this.client.get('states')).data;
    }

}

const url = 'http://192.168.2.18:8123'
const token = '';

export const ha = new HomeAssistantAPI(url, token);


const integrationDefinition: IntegrationDefinition = {
    id: "HomeAssistant",
    name: "HomeAssistant",
    description: "Control HomeAssistant Devices.",
    connectionToggle: true,
    configurable: false,
    settingCategories: {
        integrationSettings: {
            title: "Integration Settings",
            settings: {
                haUrl: {
                    title: "Home Assistant URL",
                    type: "string",
                    default: "",
                    description: "The URL to Home Assistant",
                },
                haToken: {
                    title: "Access Token",
                    type: "string",
                    default: "",
                    description: "The Long lived access token",
                }
            }
        }
    },
    linkType: "id",
    idDetails: {
        steps:
            `1. In home assistant go to your [profile](https://my.home-assistant.io/redirect/profile) and open the *security* tab.

2. Create a long lived access token on the bottom of this page, name it Firebot and copy the token
   If you forgot to copy it, you will need to delete the existing token and create a new one.

3. Fill your Home Assistant URL and paste access token into the fields below`
    }
};

const optionsTemplate = `
      <eos-container header="Light">
          <textarea ng-model="effect.entity_id" class="form-control" name="entity_id" placeholder="Enter entity ID" rows="4" cols="100" replace-variables menu-position="under"></textarea>
      </eos-container>
`;

interface ScriptParams extends Record<string, unknown> { }

// The effect itself that later gets imported into main.ts
export const lightOnEffect = (
    runRequest: RunRequest<ScriptParams>
) => {
    const logger = runRequest.modules.logger;
    return {
        definition: {
            id: "ha:light-on",
            name: "Home Assistant: Light On",
            description: "Turns on a light.",
            icon: "fas fa-light-on",
            categories: ["integrations"] as Effects.EffectCategory[],
            triggers: {
                command: true,
                event: true,
                manual: true,
            },
        },

        // ???
        optionsTemplate,
        optionsController: ($scope: any) => {
            if (!$scope.effect.entity_id) {
                $scope.effect.entity_id = "";
            }
        },
        // A fail-safe to make sure that the required text isn't missing in the effect input.
        optionsValidator: (effect: any) => {
            const errors = [];
            if (!effect.entity_id) {
                errors.push("Entity ID is required");
            }
            return errors;
        },
        // What to do when the event gets triggered
        onTriggerEvent: async (event: any) => {
            const effect = event.effect;
            try {



                return true;
            } catch (error) {
                logger.error(error);
                return false;
            }
        },
    };
};