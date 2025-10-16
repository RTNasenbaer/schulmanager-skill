"use strict";
/**
 * WeekScheduleIntent Handler
 * Gibt den Stundenplan für die Woche aus
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeekScheduleIntentHandler = void 0;
const apiClient_service_1 = require("../services/apiClient.service");
exports.WeekScheduleIntentHandler = {
    canHandle(handlerInput) {
        return (handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'WeekScheduleIntent');
    },
    async handle(handlerInput) {
        try {
            const userId = handlerInput.requestEnvelope.context.System.user.userId;
            const weekSchedule = await apiClient_service_1.apiClient.getWeekTimetable(userId);
            if (!weekSchedule || !weekSchedule.schedule) {
                const speakOutput = 'Für diese Woche ist kein Stundenplan verfügbar.';
                return handlerInput.responseBuilder
                    .speak(speakOutput)
                    .getResponse();
            }
            let speakOutput = `Dein Stundenplan für Woche ${weekSchedule.weekNumber}: `;
            const days = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];
            Object.entries(weekSchedule.schedule).forEach(([date, lessons]) => {
                const dayIndex = new Date(date).getDay() - 1;
                if (dayIndex >= 0 && dayIndex < 5) {
                    speakOutput += `${days[dayIndex]}: ${lessons.length} Stunden. `;
                }
            });
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
        }
        catch (error) {
            console.error('Error fetching week schedule:', error);
            const speakOutput = 'Es gab ein Problem beim Abrufen des Wochenplans. ' +
                'Bitte versuche es später erneut.';
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
        }
    },
};
//# sourceMappingURL=WeekScheduleIntentHandler.js.map