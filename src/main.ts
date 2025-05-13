import { Firebot, RunRequest } from "@crowbartools/firebot-custom-scripts-types";
import { HomeAssistant } from "./integration"
import { HomeAssistantAPI } from "./homeassistant";
import * as controlLight from "./effects/control-light";
import * as runScript from "./effects/run-script";
import * as applyScene from "./effects/apply-scene";

interface Params { }
interface ScriptParams extends Record<string, unknown> { }

const script: Firebot.CustomScript<Params> = {
  getScriptManifest: () => {
    return {
      name: "Firebot Home Assistant",
      description:
        "Custom Script for Integrating Home Assistant into Firebot for controlling Smart Lights!",
      author: "TSGPL_ & M1sterTux",
      version: "0.1.1",
      firebotVersion: "5",
      startupOnly: true,
    };
  },
  getDefaultParameters: () => {
    return {};
  },
  run: (runRequest: RunRequest<ScriptParams>) => {
    const { logger, integrationManager, effectManager } = runRequest.modules;
    logger.info("Loading Home Assistant custom script")

    const ha = HomeAssistantAPI.make();

    // Load Integration setup
    integrationManager.registerIntegration(HomeAssistant(logger, ha));

    // Load effects
    effectManager.registerEffect(controlLight.effect(runRequest));
    effectManager.registerEffect(runScript.effect());
    effectManager.registerEffect(applyScene.effect());
  },
};

export default script;