/**
 * WeekCancelledIntent Handler
 * Gibt ausgefallene Stunden für die Woche aus
 */

import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { Response, IntentRequest } from 'ask-sdk-model';
import { apiClient } from '../services/apiClient.service';

export const WeekCancelledIntentHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      (handlerInput.requestEnvelope.request as IntentRequest).intent.name === 'WeekCancelledIntent'
    );
  },

  async handle(handlerInput: HandlerInput): Promise<Response> {
    try {
      const userId = handlerInput.requestEnvelope.context.System.user.userId;
      const weekCancelled = await apiClient.getWeekCancelled(userId);

      if (!weekCancelled || weekCancelled.length === 0) {
        const speakOutput = 'Diese Woche sind keine Stunden ausgefallen.';
        return handlerInput.responseBuilder
          .speak(speakOutput)
          .getResponse();
      }

      let speakOutput = `Diese Woche ${weekCancelled.length === 1 ? 'fällt eine Stunde aus' : `fallen ${weekCancelled.length} Stunden aus`}. `;

      // Group by date
      const byDate: { [key: string]: any[] } = {};
      weekCancelled.forEach((lesson: any) => {
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

    } catch (error) {
      console.error('Error fetching week cancelled:', error);

      const speakOutput = 
        'Es gab ein Problem beim Abrufen der ausgefallenen Stunden. ' +
        'Bitte versuche es später erneut.';

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();
    }
  },
};
