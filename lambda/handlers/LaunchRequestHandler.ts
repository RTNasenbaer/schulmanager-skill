/**
 * LaunchRequest Handler
 * Wird aufgerufen wenn der Skill geöffnet wird
 */

import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';

export const LaunchRequestHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },

  handle(handlerInput: HandlerInput): Response {
    const speakOutput = 
      'Willkommen beim Schulmanager! ' +
      'Du kannst mich nach deinem Stundenplan oder Vertretungen fragen. ' +
      'Was möchtest du wissen?';

    const repromptText = 
      'Frage mich zum Beispiel: Was habe ich heute? Oder: Gibt es Vertretungen?';

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(repromptText)
      .getResponse();
  },
};
