/**
 * Cancel and Stop Intent Handler
 */

import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { Response, IntentRequest } from 'ask-sdk-model';

export const CancelStopIntentHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      (
        (handlerInput.requestEnvelope.request as IntentRequest).intent.name === 'AMAZON.CancelIntent' ||
        (handlerInput.requestEnvelope.request as IntentRequest).intent.name === 'AMAZON.StopIntent'
      )
    );
  },

  handle(handlerInput: HandlerInput): Response {
    const speakOutput = 'Tschüss! Viel Erfolg in der Schule!';

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse();
  },
};
