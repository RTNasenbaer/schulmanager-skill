/**
 * TodayScheduleIntent Handler
 * Gibt den Stundenplan für heute aus
 */

import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { Response, IntentRequest } from 'ask-sdk-model';
import { apiClient } from '../services/apiClient.service';
import { formatLessonsForSpeech } from '../utils/responseBuilder.util';

export const TodayScheduleIntentHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      (handlerInput.requestEnvelope.request as IntentRequest).intent.name === 'TodayScheduleIntent'
    );
  },

  async handle(handlerInput: HandlerInput): Promise<Response> {
    try {
      // TODO: User-ID aus Alexa-Session holen
      const userId = handlerInput.requestEnvelope.context.System.user.userId;

      // API-Call zum Backend
      const timetable = await apiClient.getTodayTimetable(userId);

      if (!timetable || !timetable.lessons || timetable.lessons.length === 0) {
        const speakOutput = 'Für heute sind keine Stunden eingetragen.';
        return handlerInput.responseBuilder
          .speak(speakOutput)
          .getResponse();
      }

      // Formatiere Lessons für Sprachausgabe
      const speakOutput = formatLessonsForSpeech(timetable.lessons);

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();

    } catch (error) {
      console.error('Error fetching today timetable:', error);

      const speakOutput = 
        'Es gab ein Problem beim Abrufen deines Stundenplans. ' +
        'Bitte versuche es später erneut.';

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();
    }
  },
};
