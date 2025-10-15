"use strict";
/**
 * NextLessonIntent Handler
 * Gibt die nächste anstehende Stunde aus
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NextLessonIntentHandler = void 0;
const apiClient_service_1 = require("../services/apiClient.service");
const timeHelper_util_1 = require("../utils/timeHelper.util");
exports.NextLessonIntentHandler = {
    canHandle(handlerInput) {
        return (handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'NextLessonIntent');
    },
    async handle(handlerInput) {
        try {
            const userId = handlerInput.requestEnvelope.context.System.user.userId;
            const timetable = await apiClient_service_1.apiClient.getTodayTimetable(userId);
            if (!timetable || !timetable.lessons || timetable.lessons.length === 0) {
                const speakOutput = 'Für heute sind keine Stunden mehr eingetragen.';
                return handlerInput.responseBuilder
                    .speak(speakOutput)
                    .getResponse();
            }
            const nextLesson = (0, timeHelper_util_1.findNextLesson)(timetable.lessons);
            if (!nextLesson) {
                const speakOutput = 'Für heute sind keine weiteren Stunden mehr.';
                return handlerInput.responseBuilder
                    .speak(speakOutput)
                    .getResponse();
            }
            const speakOutput = `Als nächstes hast du ${nextLesson.subject} um ${nextLesson.startTime} Uhr ` +
                `bei ${nextLesson.teacher} in Raum ${nextLesson.room}.`;
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
        }
        catch (error) {
            console.error('Error fetching next lesson:', error);
            const speakOutput = 'Es gab ein Problem beim Abrufen der nächsten Stunde. ' +
                'Bitte versuche es später erneut.';
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
        }
    },
};
//# sourceMappingURL=NextLessonIntentHandler.js.map