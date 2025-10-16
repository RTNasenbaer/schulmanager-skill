"use strict";
/**
 * WeekCancelledIntent Handler
 * Gibt ausgefallene Stunden für die Woche aus
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeekCancelledIntentHandler = void 0;
const apiClient_service_1 = require("../services/apiClient.service");
exports.WeekCancelledIntentHandler = {
    canHandle(handlerInput) {
        return (handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'WeekCancelledIntent');
    },
    async handle(handlerInput) {
        try {
            const userId = handlerInput.requestEnvelope.context.System.user.userId;
            const weekCancelled = await apiClient_service_1.apiClient.getWeekCancelled(userId);
            if (!weekCancelled || weekCancelled.length === 0) {
                const speakOutput = 'Diese Woche sind keine Stunden ausgefallen.';
                return handlerInput.responseBuilder
                    .speak(speakOutput)
                    .getResponse();
            }
            let speakOutput = `Diese Woche ${weekCancelled.length === 1 ? 'fällt eine Stunde aus' : `fallen ${weekCancelled.length} Stunden aus`}. `;
            // Group by date
            const byDate = {};
            weekCancelled.forEach((lesson) => {
                if (!byDate[lesson.date]) {
                    byDate[lesson.date] = [];
                }
                byDate[lesson.date].push(lesson);
            });
            Object.entries(byDate).forEach(([date, lessons]) => {
                const dayName = new Date(date).toLocaleDateString('de-DE', { weekday: 'long' });
                speakOutput += `${dayName}: ${lessons.length} Stunde${lessons.length > 1 ? 'n' : ''}. `;
            });
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
        }
        catch (error) {
            console.error('Error fetching week cancelled:', error);
            const speakOutput = 'Es gab ein Problem beim Abrufen der ausgefallenen Stunden. ' +
                'Bitte versuche es später erneut.';
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
        }
    },
};
//# sourceMappingURL=WeekCancelledIntentHandler.js.map