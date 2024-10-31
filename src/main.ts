import {
  Firebot,
  RunRequest,
} 
from "@crowbartools/firebot-custom-scripts-types";
import { HomeAssistantLightEffect } from "./light-effect";
import { getIntegration } from "./ha-integration"

const scriptVersion = "1.0.0";
interface Params {}
interface ScriptParams extends Record<string, unknown> {}

// Script Name, Description, Author, Etc.
const script: Firebot.CustomScript<Params> = {
  getScriptManifest: () => {
    return {
      name: "Firebot Home Assistant",
      description:
        "Custom Script for Integrating Home Assistant into Firebot for controlling Smart Lights!",
      author: "TSGPL_, M1sterTux",
      version: "0.1.0",
      firebotVersion: "5",
      startupOnly: true,
    };
  },
  getDefaultParameters: () => {
    return {};
  // The part that runs the ha-integration.ts and light-effect.ts scripts  
  },
  run: (runRequest: RunRequest<ScriptParams>) => {
    const { logger, integrationManager } = runRequest.modules;
    integrationManager.registerIntegration(getIntegration(logger));
    logger.info("Registering The Home Assistant Light Effect...");
    runRequest.modules.effectManager.registerEffect(
      HomeAssistantLightEffect(runRequest)
    );
  },
};

export default script;