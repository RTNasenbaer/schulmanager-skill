"use strict";
/**
 * Help Intent Handler
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpIntentHandler = void 0;
exports.HelpIntentHandler = {
    canHandle(handlerInput) {
        return (handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Mit dem Schulmanager Skill kannst du deinen Stundenplan abfragen. ' +
            'Du kannst mich fragen: Was habe ich heute? Was habe ich morgen? ' +
            'Gibt es Vertretungen? Oder: Was habe ich als nächstes? ' +
            'Was möchtest du wissen?';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('Was möchtest du wissen?')
            .getResponse();
    },
};
//# sourceMappingURL=HelpIntentHandler.js.map