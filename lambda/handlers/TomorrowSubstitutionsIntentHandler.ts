/**
 * TomorrowSubstitutionsIntent Handler
 * Gibt die Vertretungen für morgen aus
 */

import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { Response, IntentRequest } from 'ask-sdk-model';
import { apiClient } from '../services/apiClient.service';

export const TomorrowSubstitutionsIntentHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      (handlerInput.requestEnvelope.request as IntentRequest).intent.name === 'TomorrowSubstitutionsIntent'
    );
  },

  async handle(handlerInput: HandlerInput): Promise<Response> {
    try {
      const userId = handlerInput.requestEnvelope.context.System.user.userId;
      const substitutions = await apiClient.getTomorrowSubstitutions(userId);

      if (!substitutions || substitutions.length === 0) {
        const speakOutput = 'Für morgen sind keine Vertretungen eingetragen.';
        return handlerInput.responseBuilder
          .speak(speakOutput)
          .getResponse();
      }

      let speakOutput = `Du hast ${substitutions.length} Vertretung${substitutions.length > 1 ? 'en' : ''} für morgen. `;
      
      substitutions.forEach((sub: any, index: number) => {
        speakOutput += `${index + 1}. Stunde: ${sub.subject} bei ${sub.teacher} in Raum ${sub.room}. `;
      });

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();

    } catch (error) {
      console.error('Error fetching tomorrow substitutions:', error);

      const speakOutput = 
        'Es gab ein Problem beim Abrufen der Vertretungen für morgen. ' +
        'Bitte versuche es später erneut.';

      return handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse();
    }
  },
};
