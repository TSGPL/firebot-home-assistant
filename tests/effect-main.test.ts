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
      name: "Clean Bad Words",
      description:
        "Passes a user entered message through a bad word filter and returns the cleaned message to a Custom Variable.",
      author: "codehdn",
      website: "https://codehdn.com",
      version: scriptVersion,
      firebotVersion: "5",
    };
  },
  getDefaultParameters: () => {
    return {};
  // The part that runs the test.ts script  
  },
  run: (runRequest: RunRequest<ScriptParams>) => {
    const { logger } = runRequest.modules;
    logger.info("Registering Clean Bad Words Effect...");
    runRequest.modules.effectManager.registerEffect(
      buildTestEffect(runRequest)
    );
  },
};

export default script;