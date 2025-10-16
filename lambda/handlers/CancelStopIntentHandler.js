"use strict";
/**
 * Cancel and Stop Intent Handler
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelStopIntentHandler = void 0;
exports.CancelStopIntentHandler = {
    canHandle(handlerInput) {
        return (handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent' ||
                handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent'));
    },
    handle(handlerInput) {
        const speakOutput = 'Tschüss! Viel Erfolg in der Schule!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    },
};
