import { Integration, IntegrationController, IntegrationData, IntegrationDefinition, IntegrationManager, LinkData } from '@crowbartools/firebot-custom-scripts-types/types/modules/integration-manager';
//import { EventManager, EventSource } from '@crowbartools/firebot-custom-scripts-types/types/modules/event-manager';
//import { EventFilter } from '@crowbartools/firebot-custom-scripts-types/types/modules/event-filter-manager';
//import { EventEmitter } from 'events';
//import axios from "axios";
//import { RunRequest } from '@crowbartools/firebot-custom-scripts-types';
//import { Logger } from '@crowbartools/firebot-custom-scripts-types/types/modules/logger';
//import { Effects } from '@crowbartools/firebot-custom-scripts-types/types/effects';
//import { ReplaceVariableManager } from '@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager';

import * as homeassistant from 'homeassistant-ts';

const ha = new homeassistant.Client({
    baseUrl: process.env.HASS_URL,
    token: process.env.HASS_TOKEN,
});

const services = await ha.services.list();
console.log(services);

const logs = await ha.logbook.list();
console.log(logs);

const calendar = await ha.calendars.retrieve('calendar.calendar_name');
console.log(calendar);


const integrationDefinition: IntegrationDefinition = {
    id: "HomeAssistant",
    name: "HomeAssistant",
    description: "Control HomeAssistant Devices.",
    connectionToggle: true,
    configurable: false,
//    settingCategories: {
//        integrationSettings: {
//            title: "Integration Settings",
//            settings: {
//                pollInterval: {
//                   title: "Poll Interval",
//                    type: "number",
//                    default: 5,
//                    description: "How often to poll Tiltify for new donations (in seconds).",
//                }
//            }
//        },
//        campaignSettings: {
//            title: "Campaign Settings",
//            settings: {
//                campaignId: {
//                    title: "Campaign ID",
//                    type: "string",
//                    description: "ID of the running campaign to fetch donations for.",
//                    default: "",
//                }
//            },
//        }
//    },
    linkType: "id",
    idDetails: {
        steps: 
`1. Log in to [Tiltify](https://dashboard.tiltify.com/)

2. Go to your \`My account\` and then to the \`Connected accounts\` tab

3. Click \`Your applications\` and then \`create application\`

4. In the form, enter a \`Firebot\` as the name and enter \`http://localhost\` as the redirect URL

5. Copy the access token and paste it into the field below`
    }
};