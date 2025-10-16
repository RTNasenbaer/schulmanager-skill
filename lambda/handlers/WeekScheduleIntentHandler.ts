/**
 * WeekScheduleIntent Handler
 * Gibt den Stundenplan für die Woche aus
 */

import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { Response, IntentRequest } from 'ask-sdk-model';
import { apiClient } from '../services/apiClient.service';

export const WeekScheduleIntentHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      (handlerInput.requestEnvelope.request as IntentRequest).intent.name === 'WeekScheduleIntent'
    );
  },

  async handle(handlerInput: HandlerInput): Promise<Response> {
    try {
      const userId = handlerInput.requestEnvelope.context.System.user.userId;
      const weekSchedule = await apiClient.getWeekTimetable(userId);

      if (!weekSchedule || !weekSchedule.schedule) {
        const speakOutput = 'Für diese Woche ist kein Stundenplan verfügbar.';
        return handlerInput.responseBuilder
          .speak(speakOutput)
          .getResponse();
      }

      let speakOutput = `Dein Stundenplan für Woche ${weekSchedule.weekNumber}: `;
      
      const days = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];
      Object.entries(weekSchedule.schedule).forEach(([date, lessons]: [string, any]) => {
        const dayIndex = new Date(date).getDay() - 1;
        if (dayIndex >= 0 && dayIndex < 5) {
          speakOutput += `${days[dayIndex]}: ${lessons.length} Stunden. `;
        }
      });

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();

    } catch (error) {
      console.error('Error fetching week schedule:', error);

      const speakOutput = 
        'Es gab ein Problem beim Abrufen des Wochenplans. ' +
        'Bitte versuche es später erneut.';

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();
    }
  },
};
