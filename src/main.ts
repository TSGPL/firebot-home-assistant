import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import * as homeassistant from '@brittonhayes/homeassistant-ts';
//import { register } from "./homeassistant";

interface Params {
  message: string;
}

const script: Firebot.CustomScript<Params> = {
  getScriptManifest: () => {
    return {
      name: "Home Assistant Integration",
      description: "[WIP] A script that allows you to connect Home Assistant to Firebot, so that you can control your smart lights.",
      author: "TSG",
      version: "0.0.1",
      firebotVersion: "5",
    };
  },
  getDefaultParameters: () => {
    return {};
  },
  run: (runRequest) => {
    const { logger } = runRequest.modules;
    logger.info(runRequest.parameters.message);
    register(runRequest)
  },
};

export default script;
