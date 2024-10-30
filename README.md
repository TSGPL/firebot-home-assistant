# [WORK IN PROGRESS] Home Assistant Integration for Firebot

## Overview
Have you ever wanted to control your lights however you'd like with firebot, but you don't have any Philips Hue light due to their price?
Well, as long as those lights are connected through Home Assistant, now you can!

For now, the integration currently adds 1 effect. Which allows you to control any lights that you have connected through Home Assistant. We're open to adding more features in the future, but this is the integrations main feature/purpose!

## Prerequisites
You must have a [Home Assistant](https://www.home-assistant.io/) instance hosted on your private network, which you can install in different ways by checking out the [Home Assistant Documentation](https://www.home-assistant.io/installation/).

## How to use
1. Download the latest **firebot-ha.js** file from [Releases](https://github.com/phroggster/firebot-google-cloud-tts/releases)
2. Add the **firebot-ha.js** as a startup script in [Firebot](https://firebot.app/) (Settings > Advanced > Startup Scripts).
3. After restarting Firebot. The Home Assistant integration, and a new effect called **Control Home Assistant Light** will have been added.
4. Visit the Integration settings (Settings > Integrations). And under the *Configure* tab, paste in the URL and Access Token of your Home Assistant instance. (Steps on where to find your access token are in the configuration tab of the integration)

## Future Features
The following list of features are planned to be implemented, do note that this list may change over time. And some of the features that are currently listed might not be added (they're also placed in no particular order):
- [ ] Add an effect for controlling smart plugs.

## Credits
Due to this being our first Firebot Script. Not all, but a lot of the scripts are based or copied from other projects. So it only felt right to credit them here!

- [codehdn/firebot-clean-bad-words-script](https://github.com/codehdn/firebot-clean-bad-words-script/tree/main) For being the script that we used to learn the structure of firebot scripts, and to get a very first proof of concept script made.
- [phroggster/firebot-google-cloud-tts](https://github.com/phroggster/firebot-google-cloud-tts/tree/main) For having an awesome README.md that was used to create this one.
- [crowbartools' philips hue integration](https://github.com/crowbartools/Firebot/tree/master/src/backend/integrations/builtin/philips-hue) For the code used in the great looking Light Effect UI.
- [ebiggz/integration-example](https://github.com/ebiggz/integration-example/tree/main) For the awesome example scripts for creating Firebot Integrations.
