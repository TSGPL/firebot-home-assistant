import { RunRequest } from "@crowbartools/firebot-custom-scripts-types";
import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";

interface ScriptParams extends Record<string, unknown> {}


const optionsTemplate = `
      <eos-container header="Text">
          <textarea ng-model="effect.text" class="form-control" name="text" placeholder="Enter text" rows="4" cols="100" replace-variables menu-position="under"></textarea>
      </eos-container>
      <eos-container header="Custom Variable">
        <div class="input-group" style="margin-top: 4px">
          <label class="input-group-addon">Custom Variable Name</label>
          <textarea ng-model="effect.variableName" class="form-control" name="text" placeholder="Name your custom variable" rows="1" cols="100" replace-variables menu-position="under"></textarea>
        </div>
      </eos-container>
`;


export const buildTestEffect = (
    runRequest: RunRequest<ScriptParams>
) => {
    const logger = runRequest.modules.logger;
    return {
        definition: {
            id: "tsg:testing",
            name: "Testing Stuff",
            description:
              "For Testing, it reverses the text.",
            icon: "fad fa-hands-wash",
            categories: ["chat based"] as Effects.EffectCategory[],
            triggers: {
              command: true,
              event: true,
              manual: true,
            },
        },

        optionsTemplate,
        optionsController: ($scope: any) => {
            if (!$scope.effect.text) {
              $scope.effect.text = "";
            }
            if (!$scope.effect.variableName) {
              $scope.effect.variableName = "";
            }
        },

        optionsValidator: (effect: any) => {
            const errors = [];
            if (!effect.text) {
              errors.push("Text to clean is required");
            }
            return errors;
          },

        onTriggerEvent: async (event: any) => {
            const effect = event.effect;
            try {
              const processedText = (effect.text).split("").reverse().join("");
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