/**
 * Help Intent Handler
 */

import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { Response, IntentRequest } from 'ask-sdk-model';

export const HelpIntentHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      (handlerInput.requestEnvelope.request as IntentRequest).intent.name === 'AMAZON.HelpIntent'
    );
  },

  handle(handlerInput: HandlerInput): Response {
    const speakOutput = 
      'Mit dem Schulmanager Skill kannst du deinen Stundenplan abfragen. ' +
      'Du kannst mich fragen: Was habe ich heute? Was habe ich morgen? ' +
      'Gibt es Vertretungen? Oder: Was habe ich als nächstes? ' +
      'Was möchtest du wissen?';

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt('Was möchtest du wissen?')
      .getResponse();
  },
};
