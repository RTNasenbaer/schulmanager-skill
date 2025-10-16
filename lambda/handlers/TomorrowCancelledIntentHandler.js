"use strict";
/**
 * TomorrowCancelledIntent Handler
 * Gibt ausgefallene Stunden für morgen aus
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TomorrowCancelledIntentHandler = void 0;
const apiClient_service_1 = require("../services/apiClient.service");
exports.TomorrowCancelledIntentHandler = {
    canHandle(handlerInput) {
        return (handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'TomorrowCancelledIntent');
    },
    async handle(handlerInput) {
        try {
            const userId = handlerInput.requestEnvelope.context.System.user.userId;
            const cancelled = await apiClient_service_1.apiClient.getTomorrowCancelled(userId);
            if (!cancelled || cancelled.length === 0) {
                const speakOutput = 'Für morgen sind keine Stunden ausgefallen.';
                return handlerInput.responseBuilder
                    .speak(speakOutput)
                    .getResponse();
            }
            let speakOutput = `Morgen ${cancelled.length === 1 ? 'fällt eine Stunde aus' : `fallen ${cancelled.length} Stunden aus`}. `;
            cancelled.forEach((lesson, index) => {
                speakOutput += `${index + 1}. ${lesson.subject} bei ${lesson.teacher}. `;
            });
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
        }
        catch (error) {
            console.error('Error fetching tomorrow cancelled:', error);
            const speakOutput = 'Es gab ein Problem beim Abrufen der ausgefallenen Stunden. ' +
                'Bitte versuche es später erneut.';
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
        }
    },
};
//# sourceMappingURL=TomorrowCancelledIntentHandler.js.map