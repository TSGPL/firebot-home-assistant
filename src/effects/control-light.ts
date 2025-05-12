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
        optionsController: (
            $scope: EffectScope<HaControlLightEffectData> & {
                lights: HaEntity[];
                selectedLight?: HaEntity;
                selectedLightCapabilities: {
                    color: boolean;
                    dimming: boolean;
                }
            },
        ) => {
            $scope.lights = [];

            $scope.selectedLight = null;
            $scope.selectedLightCapabilities = {
                color: false,
                dimming: false
            };

            function updateSelectedLight() {
                $scope.selectedLight = $scope.lights.find(l => l.entity_id === $scope.effect.lightId);
                $scope.selectedLightCapabilities = {
                    color: false, // $scope.selectedLight?.capabilities?.control?.colorgamuttype != null,
                    dimming: false //$scope.selectedLight?.capabilities?.control?.mindimlevel != null
                };
            }


            //logger.info("Fetching lights", await HomeAssistantAPI.make().lights());

            // @TODO: TESTING, remove when done

            const lights = [
                { entity_id: 'light.dummy_1', attributes: { friendly_name: 'Dummy 1' } } as HaEntity,
                { entity_id: 'light.dummy_2', attributes: { friendly_name: 'Dummy 2' } } as HaEntity,
                { entity_id: 'light.dummy_3', attributes: { friendly_name: 'Dummy 3' } } as HaEntity,
                { entity_id: 'light.dummy_4', attributes: { friendly_name: 'Dummy 4' } } as HaEntity,
            ];

            $scope.effect.lightId = 'light.dummy_2';
            updateSelectedLight();

            // lights.then((lights: HaEntity[]) => {
            $scope.lights = lights.map(l => ({
                ...l,
                description: l.attributes.friendly_name
            }));

            if ($scope.effect.lightId) {
                updateSelectedLight();
            }
            // });

            $scope.onSelectLight = updateSelectedLight;

            $scope.activationOptions = {
                off: "Off",
                on: "On",
                toggle: "Toggle"
            };

            $scope.transitionOptions = {
                default: "Default",
                instant: "Instant",
                fast: "Fast",
                slow: "Slow",
                custom: "Custom"
            };

            $scope.alertTypeOptions = {
                short: "Short",
                long: "Long",
                disable: "Disable"
            };

            $scope.effectAnimationOptions = {
                colorloop: "Color Loop",
                none: "None"
            };

            if ($scope.effect.transitionType == null) {
                $scope.effect.transitionType = "default";
            }
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

            if (effect.triggerAlert && !effect.alertType) {
                errors.push("Please select an alert type");
            }

            if (effect.triggerEffectAnimation && !effect.effectAnimationType) {
                errors.push("Please select an effect animation type");
            }

            if (effect.transitionType === "custom" && (effect.customTransitionSecs == null || parseFloat(effect.customTransitionSecs) <= 0)) {
                errors.push("Please enter a custom transition time greater than 0");
            }

            return errors;
        },
        // What to do when the event gets triggered
        onTriggerEvent: async (event: any) => {
            HomeAssistantAPI.make().controlLight(event.effect);
        },
    };
};
