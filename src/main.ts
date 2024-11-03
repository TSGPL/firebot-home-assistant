import { Firebot, RunRequest } from "@crowbartools/firebot-custom-scripts-types";
import { HomeAssistant } from "./integration"
import * as controlLight from "./effects/control-light";
import * as toggleLight from "./effects/toggle-light";

interface Params { }
interface ScriptParams extends Record<string, unknown> { }

const script: Firebot.CustomScript<Params> = {
  getScriptManifest: () => {
    return {
      name: "Firebot Home Assistant",
      description:
        "Custom Script for Integrating Home Assistant into Firebot for controlling Smart Lights!",
      author: "TSGPL_ & M1sterTux",
      version: "0.1.0",
      firebotVersion: "5",
      startupOnly: true,
    };
  },
  getDefaultParameters: () => {
    return {};
  },
  run: (runRequest: RunRequest<ScriptParams>) => {
    const { logger, integrationManager } = runRequest.modules;
    logger.info("Loading Home Assistant custom script")

    // Load Integration setup
    integrationManager.registerIntegration(HomeAssistant(logger));

    // Load effects
    runRequest.modules.effectManager.registerEffect(controlLight.effect(runRequest));
    runRequest.modules.effectManager.registerEffect(toggleLight.effect(runRequest));
  },
};

export default script;