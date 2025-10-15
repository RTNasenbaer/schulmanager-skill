"use strict";
/**
 * TomorrowScheduleIntent Handler
 * Gibt den Stundenplan für morgen aus
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TomorrowScheduleIntentHandler = void 0;
const apiClient_service_1 = require("../services/apiClient.service");
const responseBuilder_util_1 = require("../utils/responseBuilder.util");
exports.TomorrowScheduleIntentHandler = {
    canHandle(handlerInput) {
        return (handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'TomorrowScheduleIntent');
    },
    async handle(handlerInput) {
        try {
            const userId = handlerInput.requestEnvelope.context.System.user.userId;
            const timetable = await apiClient_service_1.apiClient.getTomorrowTimetable(userId);
            if (!timetable || !timetable.lessons || timetable.lessons.length === 0) {
                const speakOutput = 'Für morgen sind keine Stunden eingetragen.';
                return handlerInput.responseBuilder
                    .speak(speakOutput)
                    .getResponse();
            }
            const speakOutput = (0, responseBuilder_util_1.formatLessonsForSpeech)(timetable.lessons, 'morgen');
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
        }
        catch (error) {
            console.error('Error fetching tomorrow timetable:', error);
            const speakOutput = 'Es gab ein Problem beim Abrufen des Stundenplans für morgen. ' +
                'Bitte versuche es später erneut.';
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
        }
    },
};
//# sourceMappingURL=TomorrowScheduleIntentHandler.js.map