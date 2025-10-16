"use strict";
/**
 * TodayScheduleIntent Handler
 * Gibt den Stundenplan für heute aus
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodayScheduleIntentHandler = void 0;
const apiClient_service_1 = require("../services/apiClient.service");
const responseBuilder_util_1 = require("../utils/responseBuilder.util");
exports.TodayScheduleIntentHandler = {
    canHandle(handlerInput) {
        return (handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'TodayScheduleIntent');
    },
    async handle(handlerInput) {
        try {
            // TODO: User-ID aus Alexa-Session holen
            const userId = handlerInput.requestEnvelope.context.System.user.userId;
            // API-Call zum Backend
            const timetable = await apiClient_service_1.apiClient.getTodayTimetable(userId);
            if (!timetable || !timetable.lessons || timetable.lessons.length === 0) {
                const speakOutput = 'Für heute sind keine Stunden eingetragen.';
                return handlerInput.responseBuilder
                    .speak(speakOutput)
                    .getResponse();
            }
            // Formatiere Lessons für Sprachausgabe
            const speakOutput = (0, responseBuilder_util_1.formatLessonsForSpeech)(timetable.lessons);
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
        }
        catch (error) {
            console.error('Error fetching today timetable:', error);
            const speakOutput = 'Es gab ein Problem beim Abrufen deines Stundenplans. ' +
                'Bitte versuche es später erneut.';
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
        }
    },
};
