"use strict";
/**
 * LaunchRequest Handler
 * Wird aufgerufen wenn der Skill geöffnet wird
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LaunchRequestHandler = void 0;
exports.LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Willkommen beim Schulmanager! ' +
            'Du kannst mich nach deinem Stundenplan oder Vertretungen fragen. ' +
            'Was möchtest du wissen?';
        const repromptText = 'Frage mich zum Beispiel: Was habe ich heute? Oder: Gibt es Vertretungen?';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            .getResponse();
    },
};
//# sourceMappingURL=LaunchRequestHandler.js.map