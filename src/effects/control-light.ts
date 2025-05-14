import { RunRequest } from "@crowbartools/firebot-custom-scripts-types";
import { Effects, EffectScope } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import { HomeAssistantAPI, HaEntity } from "../homeassistant";
import { HomeAssistant } from "../integration";

interface ScriptParams extends Record<string, unknown> { }
export type HaControlLightEffectData = {
    lightId: string;
    updateActivated: boolean;
    activationAction?: "off" | "on" | "toggle";
    updateBrightness: boolean;
    brightnessPercentage?: string;
    updateColor: boolean;
    /**
     * Hex color string
     */
    color?: string;
    triggerEffectAnimation: boolean;
    effectAnimationType?: "colorloop" | "none";
    triggerAlert: boolean;
    alertType?: "short" | "long" | "disable";
    transitionType?: "default" | "instant" | "fast" | "slow" | "custom";
    customTransitionSecs?: string;
};

export const effect = (runRequest: RunRequest<ScriptParams>) => {
    const logger = runRequest.modules.logger;
    return {
        definition: {
            id: "ha:control-light",
            name: "Control Home Assistant Light",
            description: "Control a Home Assistant Light",
            icon: "far fa-lightbulb fa-align-center",
            categories: ["fun", "integrations"] as Effects.EffectCategory[],
        },
        optionsTemplate: `
            <eos-container header="Light">
                <firebot-input
                    input-title="Light"
                    model="effect.lightId"
                    placeholder="Please enter a light entity_id"
                />
            </eos-container>
        
            <eos-container header="Options" ng-if="effect.lightId" pad-top="true">
                <firebot-checkbox
                    label="Update Activated"
                    model="effect.updateActivated"
                />
                <div ng-if="effect.updateActivated" class="ml-10 mb-3">
                    <dropdown-select
                        options="activationOptions"
                        selected="effect.activationAction"
                    />
                </div>
        
                <firebot-checkbox
                    label="Update Brightness"
                    model="effect.updateBrightness"
                />
                <div ng-if="effect.updateBrightness" class="ml-10 mb-3">
                    <firebot-input
                        input-title="Percentage (1-100)"
                        data-type="number"
                        model="effect.brightnessPercentage"
                        placeholder-text="Enter brightness percentage"
                    />
                </div>
        
                <firebot-checkbox
                    label="Update Color"
                    model="effect.updateColor"
                />
                <div ng-if="effect.updateColor" class="ml-10 mb-3">
                    <color-picker-input model="effect.color" />
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

            if (!effect.lightId) {
                errors.push("Please select a light");
            }

            if (effect.updateActivated && !effect.activationAction) {
                errors.push("Please select an activation action");
            }

            if (effect.updateBrightness && !effect.brightnessPercentage) {
                errors.push("Please enter a brightness percentage");
            }

            if (effect.updateColor && !effect.color) {
                errors.push("Please select a color");
            }

            return errors;
        },
        // What to do when the event gets triggered
        onTriggerEvent: async (event: any) => {
            HomeAssistantAPI.make().controlLight(event.effect);
        },
    };
};
