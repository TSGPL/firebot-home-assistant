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
            id: "ha:control-light",
            name: "Control Home Assistant Light",
            description: "Control a Home Assistant Light",
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
                <firebot-searchable-select
                    items="lights"
                    ng-model="effect.lightId"
                    on-select="onSelectLight()"
                    placeholder="Search for light"
                />
            </eos-container>
            <eos-container header="Options" ng-if="selectedLight != null" pad-top="true">
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
                <div ng-if="selectedLightCapabilities.dimming">
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
                </div>
                <div ng-if="selectedLightCapabilities.color">
                    <firebot-checkbox
                        label="Update Color"
                        model="effect.updateColor"
                    />
                    <div ng-if="effect.updateColor" class="ml-10 mb-3">
                        <color-picker-input
                            model="effect.color"
                        />
                    </div>
                </div>
                <div ng-if="selectedLightCapabilities.dimming">
                    <firebot-checkbox
                        label="Trigger Alert"
                        model="effect.triggerAlert"
                    />
                    <div ng-if="effect.triggerAlert" class="ml-10 mb-3">
                        <dropdown-select
                            options="alertTypeOptions"
                            selected="effect.alertType"
                        />
                    </div>
                </div>
                <div ng-if="selectedLightCapabilities.color">
                    <firebot-checkbox
                        label="Set Effect Animation"
                        model="effect.triggerEffectAnimation"
                    />
                    <div ng-if="effect.triggerEffectAnimation" class="ml-10 mb-3">
                        <dropdown-select
                            options="effectAnimationOptions"
                            selected="effect.effectAnimationType"
                        />
                    </div>
                </div>
                <div>
                    <h4>Transition</h4>
                    <dropdown-select
                        options="transitionOptions"
                        selected="effect.transitionType"
                    />
                    <div ng-if="effect.transitionType == 'custom'" class="mt-3">
                        <firebot-input
                            input-title="Seconds"
                            data-type="number"
                            model="effect.customTransitionSecs"
                            placeholder-text="Enter seconds"
                        />
                    </div>
                </div>
            </eos-container>`,
        optionsController: ($scope: any) => {
            if (!$scope.effect.text) {
                $scope.effect.text = "";
            }
            if (!$scope.effect.variableName) {
                $scope.effect.variableName = "";
            }
        },
        // A fail-safe to make sure that the required text isn't missing in the effect input.
        optionsValidator: (effect: any) => {
            const errors = [];
            if (!effect.text) {
                errors.push("Text to clean is required");
            }
            return errors;
        },
        // What to do when the event gets triggered
        onTriggerEvent: async (event: any) => {
            const effect = event.effect;
            try {

                return true;
            } catch (error) {
                logger.error(error);
                return false;
            }
        },
    };
};
