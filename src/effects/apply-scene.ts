import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import { HomeAssistantAPI } from "../homeassistant";

interface ScriptParams extends Record<string, unknown> {}

export const effect = () => {
    return {
        definition: {
            id: "ha:apply-scene",
            name: "Apply Home Assistant Scene",
            description: "Apply a Home Assistant scene",
            icon: "far fa-house-signal fa-align-center",
            categories: ["fun", "integrations"] as Effects.EffectCategory[],
        },
        optionsTemplate: `
            <eos-container header="Scene">
                <firebot-input
                    input-title="Scene"
                    model="effect.entity_id"
                    placeholder="Enter entity ID"
                />
            </eos-container>`,
        optionsController: () => {},
        // A fail-safe to make sure that the required text isn't missing in the effect input.
        optionsValidator: (effect: any) => {
            const errors = [];

            if (!effect.entity_id) {
                errors.push("Please enter a scene entity_id");
            }

            return errors;
        },
        // What to do when the event gets triggered
        onTriggerEvent: async (event: any) => {
            HomeAssistantAPI.make().applyScene(event.effect);
        },
    };
};
