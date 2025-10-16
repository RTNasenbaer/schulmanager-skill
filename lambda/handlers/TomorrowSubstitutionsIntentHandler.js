"use strict";
/**
 * TomorrowSubstitutionsIntent Handler
 * Gibt die Vertretungen für morgen aus
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TomorrowSubstitutionsIntentHandler = void 0;
const apiClient_service_1 = require("../services/apiClient.service");
exports.TomorrowSubstitutionsIntentHandler = {
    canHandle(handlerInput) {
        return (handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'TomorrowSubstitutionsIntent');
    },
    async handle(handlerInput) {
        try {
            const userId = handlerInput.requestEnvelope.context.System.user.userId;
            const substitutions = await apiClient_service_1.apiClient.getTomorrowSubstitutions(userId);
            if (!substitutions || substitutions.length === 0) {
                const speakOutput = 'Für morgen sind keine Vertretungen eingetragen.';
                return handlerInput.responseBuilder
                    .speak(speakOutput)
                    .getResponse();
            }
            let speakOutput = `Du hast ${substitutions.length} Vertretung${substitutions.length > 1 ? 'en' : ''} für morgen. `;
            substitutions.forEach((sub, index) => {
                speakOutput += `${index + 1}. Stunde: ${sub.subject} bei ${sub.teacher} in Raum ${sub.room}. `;
            });
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
        }
        catch (error) {
            console.error('Error fetching tomorrow substitutions:', error);
            const speakOutput = 'Es gab ein Problem beim Abrufen der Vertretungen für morgen. ' +
                'Bitte versuche es später erneut.';
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
        }
    },
};
//# sourceMappingURL=TomorrowSubstitutionsIntentHandler.js.map