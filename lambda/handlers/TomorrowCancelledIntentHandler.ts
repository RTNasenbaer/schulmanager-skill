/**
 * TomorrowCancelledIntent Handler
 * Gibt ausgefallene Stunden für morgen aus
 */

import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { Response, IntentRequest } from 'ask-sdk-model';
import { apiClient } from '../services/apiClient.service';

export const TomorrowCancelledIntentHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      (handlerInput.requestEnvelope.request as IntentRequest).intent.name === 'TomorrowCancelledIntent'
    );
  },

  async handle(handlerInput: HandlerInput): Promise<Response> {
    try {
      const userId = handlerInput.requestEnvelope.context.System.user.userId;
      const cancelled = await apiClient.getTomorrowCancelled(userId);

      if (!cancelled || cancelled.length === 0) {
        const speakOutput = 'Für morgen sind keine Stunden ausgefallen.';
        return handlerInput.responseBuilder
          .speak(speakOutput)
          .getResponse();
      }

      let speakOutput = `Morgen ${cancelled.length === 1 ? 'fällt eine Stunde aus' : `fallen ${cancelled.length} Stunden aus`}. `;
      
      cancelled.forEach((lesson: any, index: number) => {
        speakOutput += `${index + 1}. ${lesson.subject} bei ${lesson.teacher}. `;
      });

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();

    } catch (error) {
      console.error('Error fetching tomorrow cancelled:', error);

      const speakOutput = 
        'Es gab ein Problem beim Abrufen der ausgefallenen Stunden. ' +
        'Bitte versuche es später erneut.';

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();
    }
  },
};
