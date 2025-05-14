import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import { HomeAssistantAPI } from "../homeassistant";

interface ScriptParams extends Record<string, unknown> {}

export const effect = () => {
    return {
        definition: {
            id: "ha:run-script",
            name: "Run Home Assistant Script",
            description: "Run a Home Assistant script",
            icon: "fad fa-code",
            categories: ["fun", "integrations"] as Effects.EffectCategory[],
        },
        optionsTemplate: `
            <eos-container header="Script">
                <firebot-input
                    input-title="Script"
                    model="effect.entity_id"
                    placeholder="Enter entity ID"
                />
            </eos-container>`,
        optionsController: ($scope: any, backendCommunicator: any) => {
            if (!$scope.effect.text) {
                $scope.effect.text = "";
            }
            if (!$scope.effect.variableName) {
                $scope.effect.variableName = "";
            }
                
            $scope.activationOptions = {
                off: "Off",
                on: "On",
                toggle: "Toggle"
            };
        },
        // A fail-safe to make sure that the required text isn't missing in the effect input.
        optionsValidator: (effect: any) => {
            const errors = [];

            if (!effect.entity_id) {
                errors.push("Please enter a script entity_id");
            }

            return errors;
        },
        // What to do when the event gets triggered
        onTriggerEvent: async (event: any) => {
            HomeAssistantAPI.make().runScript(event.effect);
        },
    };
};
