import { RunRequest } from "@crowbartools/firebot-custom-scripts-types";
import { Effects, EffectScope } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import { HomeAssistantAPI, HaEntity } from "../homeassistant";
import { HomeAssistant } from "../integration";

interface ScriptParams extends Record<string, unknown> { }

export const effect = (runRequest: RunRequest<ScriptParams>) => {
    const logger = runRequest.modules.logger;
    return {
        definition: {
            id: "ha:control-switch",
            name: "Control Home Assistant Switch",
            description: "Control a Home Assistant Switch, for example a smart plug",
            icon: "far fa-light-switch fa-align-center",
            categories: ["fun", "integrations"] as Effects.EffectCategory[],
        },
        optionsTemplate: `
            <eos-container header="Switch">
                <firebot-input
                    input-title="switch"
                    model="effect.entity_id"
                    placeholder="Please enter a switch entity_id"
                />
            </eos-container>
        
            <eos-container header="Options" ng-if="effect.entity_id" pad-top="true">
               
                <div class="ml-10 mb-3">
                    <dropdown-select
                        options="activationOptions"
                        selected="effect.activationAction"
                    />
                </div>
    
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
                errors.push("Please select a switch");
            }

            if ( !effect.activationAction) {
                errors.push("Please select an activation action");
            }

            return errors;
        },
        // What to do when the event gets triggered
        onTriggerEvent: async (event: any) => {
            HomeAssistantAPI.make().controlSwitch(event.effect);
        },
    };
};
