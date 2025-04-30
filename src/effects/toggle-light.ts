import { RunRequest } from "@crowbartools/firebot-custom-scripts-types";
import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import { HomeAssistantAPI } from "../homeassistant";

interface ScriptParams extends Record<string, unknown> { }
const ha = HomeAssistantAPI.make();

export const effect = (
    runRequest: RunRequest<ScriptParams>
) => {
    const logger = runRequest.modules.logger;
    return {
        definition: {
            id: "ha:toggle-light",
            name: "Home Assistant: Toggle light",
            description: "Toggles a light through Home Assistant",
            icon: "far fa-lightbulb fa-align-center",
            categories: ["integrations"] as Effects.EffectCategory[],
            triggers: {
                command: true,
                event: true,
                manual: true,
            },
        },
        optionsTemplate: `
            <eos-container header="Light">
                <textarea ng-model="effect.entity" class="form-control" name="entity" placeholder="Enter entity ID" rows="1" cols="100" replace-variables menu-position="under"></textarea>
            </eos-container>`,
        optionsController: ($scope: any) => {
            if (!$scope.effect.entity) {
                $scope.effect.entity = "";
            }
        },
        optionsValidator: (effect: any) => {
            logger.debug("Toggle light validator", effect);

            const errors = [];
            if (!effect.entity) {
                errors.push("Entity ID is required");
            }
            return errors;
        },
        onTriggerEvent: async (event: any) => {
            const entity_id = event.effect.entity;
            try {
                ha.toggleLight(entity_id);

                return true;
            } catch (error) {
                logger.error(error);
                return false;
            }
        },
    };
};
