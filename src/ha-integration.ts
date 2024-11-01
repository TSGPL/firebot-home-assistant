import {
  Integration,
  IntegrationController,
  IntegrationData,
  IntegrationEvents,
} from "@crowbartools/firebot-custom-scripts-types";
import { Logger } from "@crowbartools/firebot-custom-scripts-types/types/modules/logger";
import { TypedEmitter } from "tiny-typed-emitter";


class IntegrationEventEmitter extends TypedEmitter<IntegrationEvents> { }

type IntegrationSettings = {
  integrationSettings: {
    haUrl: string;
    haToken: string;
  };
};

class HomeAssistantIntegration
  extends IntegrationEventEmitter
  implements IntegrationController<IntegrationSettings> {
  connected = false;

  constructor(private readonly logger: Logger) {
    super();
  }

  init(
    linked: boolean,
    integrationData: IntegrationData<IntegrationSettings>
  ): void | PromiseLike<void> {
    this.logger.info(
      "Home Assistant Init",
      integrationData.userSettings?.integrationSettings?.haUrl,
      integrationData.userSettings?.integrationSettings?.haToken
    );
  }

  onUserSettingsUpdate?(
    integrationData: IntegrationData<IntegrationSettings>
  ): void | PromiseLike<void> {
    this.logger.info(
      "Home Assistant updated",
      integrationData.userSettings?.integrationSettings?.haUrl,
      integrationData.userSettings?.integrationSettings?.haToken
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
    configurable: true,
    connectionToggle: false,
    settingCategories: {
      integrationSettings: {
        title: "Integration Settings",
        settings: {
          haUrl: {
            title: "Home Assistant URL",
            type: "string",
            default: "",
            description: "The URL of your Home Assistant instance",
            validation: {
              required: true,
            }
          },
          haToken: {
            title: "Access Token",
            type: "string",
            default: "",
            description: `The long lived acces token generated in Home Assistant
1. In home assistant go to your [profile](https://my.home-assistant.io/redirect/profile) and open the *security* tab.

2. Create a long lived access token on the bottom of this page, name it Firebot and copy the token
   If you forgot to copy it, you will need to delete the existing token and create a new one.

3. Fill your Home Assistant URL and paste access token into the fields below           
`,
            validation: {
              required: true,
            }
          }
        }
      }
    },
    linkType: "none"
  },
  integration: new HomeAssistantIntegration(logger),
});