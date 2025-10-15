/**
 * TomorrowScheduleIntent Handler
 * Gibt den Stundenplan für morgen aus
 */

import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { Response, IntentRequest } from 'ask-sdk-model';
import { apiClient } from '../services/apiClient.service';
import { formatLessonsForSpeech } from '../utils/responseBuilder.util';

export const TomorrowScheduleIntentHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      (handlerInput.requestEnvelope.request as IntentRequest).intent.name === 'TomorrowScheduleIntent'
    );
  },

  async handle(handlerInput: HandlerInput): Promise<Response> {
    try {
      const userId = handlerInput.requestEnvelope.context.System.user.userId;

      const timetable = await apiClient.getTomorrowTimetable(userId);

      if (!timetable || !timetable.lessons || timetable.lessons.length === 0) {
        const speakOutput = 'Für morgen sind keine Stunden eingetragen.';
        return handlerInput.responseBuilder
          .speak(speakOutput)
          .getResponse();
      }

      const speakOutput = formatLessonsForSpeech(timetable.lessons, 'morgen');

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();

    } catch (error) {
      console.error('Error fetching tomorrow timetable:', error);

      const speakOutput = 
        'Es gab ein Problem beim Abrufen des Stundenplans für morgen. ' +
        'Bitte versuche es später erneut.';

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();
    }
  },
};
