# Home Assistant Integration for Firebot [Alpha]

## Overview
Have you ever wanted to control your lights however you'd like with Firebot but don't have a Philips Hue light due to their price?
Well, as long as those lights are connected through Home Assistant, now you can!

For now, the integration adds 3 effects, which allows you to run any Scenes & Scripts, as well as control any lights that you have connected with Home Assistant.
We're open to adding more features in the future, but this is currently the integration's main purpose.

## How to use
1. Download the latest **firebot-ha.js** file from [Releases](https://github.com/TSGPL/firebot-home-assistant/releases)
2. Add the **firebot-home-assistant.js** as a startup script in [Firebot](https://firebot.app/) (Settings > Scripts > Startup Scripts).
3. After restarting Firebot. The Home Assistant integration, and a 3 new effects called **Control Home Assistant Light**, **Apply Home Assistant Scene**, & **Run Home Assistant Script** will have been added.
4. Visit the Integration settings (Settings > Integrations). And under the *Configure* tab, paste in the URL and Access Token of your Home Assistant instance. (Steps on where to find your access token are in the configuration tab of the integration, inside of firebot)

## Future Features
The following list of features that are planned to be implemented. Do note, that this list may change over time and some of the features that are currently listed might not end up being added (they're also placed in no particular order):
- [X] Add an effect for controlling smart plugs
- [ ] Add white color temperature control to the Light Effect
- [ ] Add the ability to use custom variables in the color field to the Light Effect

## Known Issues
- Can't use custom variables in the color field inside the Light Effect
- Firebot uses cached Home Assistant URL instead of the one provided.

## Credits
Due to this being our first Firebot Script. Not all, but a lot of the scripts are based on or copied from other projects. So it only felt right to credit them here!

- [codehdn/firebot-clean-bad-words-script](https://github.com/codehdn/firebot-clean-bad-words-script/tree/main) For being the script that we used to learn the structure of firebot scripts, and to get a very first proof of concept script made.
- [phroggster/firebot-google-cloud-tts](https://github.com/phroggster/firebot-google-cloud-tts/tree/main) For having an awesome README.md that was used to create this one.
- [crowbartools' philips hue integration](https://github.com/crowbartools/Firebot/tree/master/src/backend/integrations/builtin/philips-hue) For the code used in the great looking Light Effect UI.
- [ebiggz/integration-example](https://github.com/ebiggz/integration-example/tree/main) For the awesome example scripts for creating Firebot Integrations.
