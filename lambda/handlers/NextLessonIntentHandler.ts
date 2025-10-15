/**
 * NextLessonIntent Handler
 * Gibt die nächste anstehende Stunde aus
 */

import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { Response, IntentRequest } from 'ask-sdk-model';
import { apiClient } from '../services/apiClient.service';
import { findNextLesson } from '../utils/timeHelper.util';

export const NextLessonIntentHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      (handlerInput.requestEnvelope.request as IntentRequest).intent.name === 'NextLessonIntent'
    );
  },

  async handle(handlerInput: HandlerInput): Promise<Response> {
    try {
      const userId = handlerInput.requestEnvelope.context.System.user.userId;

      const timetable = await apiClient.getTodayTimetable(userId);

      if (!timetable || !timetable.lessons || timetable.lessons.length === 0) {
        const speakOutput = 'Für heute sind keine Stunden mehr eingetragen.';
        return handlerInput.responseBuilder
          .speak(speakOutput)
          .getResponse();
      }

      const nextLesson = findNextLesson(timetable.lessons);

      if (!nextLesson) {
        const speakOutput = 'Für heute sind keine weiteren Stunden mehr.';
        return handlerInput.responseBuilder
          .speak(speakOutput)
          .getResponse();
      }

      const speakOutput = 
        `Als nächstes hast du ${nextLesson.subject} um ${nextLesson.startTime} Uhr ` +
        `bei ${nextLesson.teacher} in Raum ${nextLesson.room}.`;

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();

    } catch (error) {
      console.error('Error fetching next lesson:', error);

      const speakOutput = 
        'Es gab ein Problem beim Abrufen der nächsten Stunde. ' +
        'Bitte versuche es später erneut.';

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();
    }
  },
};
