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
        "A Home Assistant integration for Firebot to control lights",
      author: "TSGPL & M1sterTux",
      version: "0.2.0 Alpha",
      firebotVersion: "5",
      startupOnly: true,
    };
  },
  getDefaultParameters: () => {
    return {};
  },
  run: (runRequest: RunRequest<ScriptParams>) => {
    const { logger, integrationManager, effectManager } = runRequest.modules;
    logger.info("Loading Home Assistant Integration")

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