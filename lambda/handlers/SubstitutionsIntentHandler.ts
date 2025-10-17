/**
 * SubstitutionsIntent Handler
 * Gibt Vertretungen und Ausfälle aus
 */

import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { Response, IntentRequest } from 'ask-sdk-model';
import { apiClient } from '../services/apiClient.service';
import { formatSubstitutionsForSpeech } from '../utils/responseBuilder.util';

export const SubstitutionsIntentHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      (handlerInput.requestEnvelope.request as IntentRequest).intent.name === 'SubstitutionsIntent'
    );
  },

  async handle(handlerInput: HandlerInput): Promise<Response> {
    try {
      const userId = handlerInput.requestEnvelope.context.System.user.userId;

      const substitutions = await apiClient.getTodaySubstitutions(userId);

      if (!substitutions || !substitutions.substitutions || substitutions.substitutions.length === 0) {
        const speakOutput = 'Für heute gibt es keine Vertretungen oder Ausfälle.';
        return handlerInput.responseBuilder
          .speak(speakOutput)
          .getResponse();
      }

      const speakOutput = formatSubstitutionsForSpeech(substitutions.substitutions);

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();

    } catch (error) {
      console.error('Error fetching substitutions:', error);

      const speakOutput = 
        'Es gab ein Problem beim Abrufen des Vertretungsplans. ' +
        'Bitte versuche es später erneut.';

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();
    }
  },
};
