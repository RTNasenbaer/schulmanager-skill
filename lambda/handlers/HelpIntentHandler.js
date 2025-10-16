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
        const speakOutput = 'Mit dem Schulmanager Skill kannst du deinen Stundenplan und Vertretungen abfragen. ' +
            'Du kannst fragen: Was habe ich heute? Was habe ich morgen? Stundenplan für die Woche? ' +
            'Gibt es Vertretungen? Welche Stunden fallen morgen aus? Was fällt diese Woche aus? ' +
            'Oder: Was habe ich als nächstes? ' +
            'Was möchtest du wissen?';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('Was möchtest du wissen?')
            .getResponse();
    },
};
//# sourceMappingURL=HelpIntentHandler.js.map