import {
    Integration,
    IntegrationController,
    IntegrationData,
    IntegrationEvents,
  } from "@crowbartools/firebot-custom-scripts-types";
import { Logger } from "@crowbartools/firebot-custom-scripts-types/types/modules/logger";
import { TypedEmitter } from "tiny-typed-emitter";
//import { consts } from "./consts";
//import { logger } from "./logger";


class IntegrationEventEmitter extends TypedEmitter<IntegrationEvents> {}

type IntegrationSettings = {
  exampleCategory: {
    exampleSetting: string;
    exampleSetting2: string;
  };
};

class ExampleIntegration
  extends IntegrationEventEmitter
  implements IntegrationController<IntegrationSettings>
{
  connected = false;

  constructor(private readonly logger: Logger) {
    super();
  }

  init(
    linked: boolean,
    integrationData: IntegrationData<IntegrationSettings>
  ): void | PromiseLike<void> {
    this.logger.info(
      "Example Integration Initialized",
      integrationData.userSettings?.exampleCategory?.exampleSetting,
      integrationData.userSettings?.exampleCategory?.exampleSetting2
    );
  }

  onUserSettingsUpdate?(
    integrationData: IntegrationData<IntegrationSettings>
  ): void | PromiseLike<void> {
    this.logger.info(
      "Example Integration settings updated",
      integrationData.userSettings?.exampleCategory?.exampleSetting,
      integrationData.userSettings?.exampleCategory?.exampleSetting2
    );
  }
}
export const getIntegration = (
  logger: Logger
): Integration<IntegrationSettings> => ({
  definition: {
    id: "home-assistant-integration",
    name: "Home Assistant",
    description: "The Home Assistant Integration for controlling Smart Lights",
    linkType: "none",
    configurable: true,
    connectionToggle: false,
    settingCategories: {
      exampleCategory: {
        title: "Integration Settings",
        settings: {
          exampleSetting: {
            title: "URL",
            type: "string",
            default: "",
            description: "The URL of your Home Assistant instance",
            validation: {
              required: true,
            },
          },
          exampleSetting2: {
            title: "Access Token",
            type: "string",
            default: "",
            description: `
1. In Home Assistant, go to your [profile](https://my.home-assistant.io/redirect/profile) and open the *Security* tab.

2. Create a long-lived access token at the bottom of this page, name it "Firebot", and copy the token.  
   If you forgot to copy it, you will need to delete the existing token and create a new one.

3. Don't forget to fill in your Home Assistant URL and paste the access token into the field below.
    `,                      
            validation: {
              required: true,
                    },
                },
            },
        },
    },
},
integration: new ExampleIntegration(logger),
});

//     id: "home-assistant-integration",
//     name: "Home Assistant",
//     description: "The Home Assistant Integration for controlling Smart Lights",
//     connectionToggle: true,
//     configurable: true,
//     settingCategories: {
//       integrationSettings: {
//           title: "Integration Settings",
//           settings: {
//               pollInterval: {
//                   title: "Home Assistant URL",
//                   type: "string",
//                   default: "",
//                   description: "The URL to your Home Assistant instance",
//               }
//           }
//       }
//   },
//     linkType: "id",
//     idDetails: {
//         steps: 
// `1. In home assistant go to your [profile](https://my.home-assistant.io/redirect/profile) and open the *security* tab.

// 2. Create a long lived access token on the bottom of this page, name it Firebot and copy the token
//    If you forgot to copy it, you will need to delete the existing token and create a new one.

// 3. Fill your Home Assistant URL and paste access token into the fields below`
//     },
//   },
//   integration: new ExampleIntegration(logger),
// });