import {
  Firebot,
  RunRequest,
} from "@crowbartools/firebot-custom-scripts-types";
import { buildTestEffect } from "./effect-test.test";

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
      author: "TSG & Tux",
      //website: "",
      version: 0.1.0,
      firebotVersion: "5",
    };
  },
  getDefaultParameters: () => {
    return {};
  // The part that runs the test.ts script  
  },
  run: (runRequest: RunRequest<ScriptParams>) => {
    const { logger } = runRequest.modules;
    logger.info("Registering The HA Lights Effect...");
    runRequest.modules.effectManager.registerEffect(
      buildTestEffect(runRequest)
    );
  },
};

export default script;