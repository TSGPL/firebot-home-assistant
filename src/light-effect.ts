import { RunRequest } from "@crowbartools/firebot-custom-scripts-types";
import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";

interface ScriptParams extends Record<string, unknown> {}

// The options template variable that gets used later on line 39
const optionsTemplate = `
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
        </eos-container>
`;

// The effect itself that later gets imported into main.ts
export const HomeAssistantLightEffect = (
    runRequest: RunRequest<ScriptParams>
) => {
    const logger = runRequest.modules.logger;
    return {
        definition: {
            id: "tsg:ha-light-effect", // ID of the effect
            name: "Control Home Assistant Light", // Name of the effect
            description:
              "Control a Home Assistant Light", // Effects Description
            icon: "far fa-lightbulb fa-align-center", // Icon that the effect uses
            categories: ["integrations"] as Effects.EffectCategory[], // In which category the effect will be found in
            triggers: {
              command: true,
              event: true,
              manual: true,
            },
        },
        // ???
        optionsTemplate,
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
              const processedText = (effect.text).split("").reverse().join(""); // The processing of the text
              // ??
              runRequest.modules.customVariableManager.addCustomVariable(
                effect.variableName,
                processedText
              );
              return true;
            } catch (error) {
              logger.error(error);
              return false;
            }
          },
        };
      };