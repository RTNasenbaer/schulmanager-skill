"use strict";
/**
 * SubstitutionsIntent Handler
 * Gibt Vertretungen und Ausfälle aus
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubstitutionsIntentHandler = void 0;
const apiClient_service_1 = require("../services/apiClient.service");
const responseBuilder_util_1 = require("../utils/responseBuilder.util");
exports.SubstitutionsIntentHandler = {
    canHandle(handlerInput) {
        return (handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'SubstitutionsIntent');
    },
    async handle(handlerInput) {
        try {
            const userId = handlerInput.requestEnvelope.context.System.user.userId;
            const substitutions = await apiClient_service_1.apiClient.getTodaySubstitutions(userId);
            if (!substitutions || !substitutions.substitutions || substitutions.substitutions.length === 0) {
                const speakOutput = 'Für heute gibt es keine Vertretungen oder Ausfälle.';
                return handlerInput.responseBuilder
                    .speak(speakOutput)
                    .getResponse();
            }
            const speakOutput = (0, responseBuilder_util_1.formatSubstitutionsForSpeech)(substitutions.substitutions);
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
        }
        catch (error) {
            console.error('Error fetching substitutions:', error);
            const speakOutput = 'Es gab ein Problem beim Abrufen des Vertretungsplans. ' +
                'Bitte versuche es später erneut.';
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
        }
    },
};
