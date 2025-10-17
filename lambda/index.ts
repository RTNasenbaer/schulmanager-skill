/**
 * Alexa Skill Entry Point
 * Lambda Handler für den Schulmanager Alexa Skill
 */

import {
  SkillBuilders,
  HandlerInput,
  ErrorHandler as AlexaErrorHandler,
} from 'ask-sdk-core';
import {
  Response,
  SessionEndedRequest,
} from 'ask-sdk-model';

// Import Handlers
import { LaunchRequestHandler } from './handlers/LaunchRequestHandler';
import { TodayScheduleIntentHandler } from './handlers/TodayScheduleIntentHandler';
import { TomorrowScheduleIntentHandler } from './handlers/TomorrowScheduleIntentHandler';
import { SubstitutionsIntentHandler } from './handlers/SubstitutionsIntentHandler';
import { TomorrowSubstitutionsIntentHandler } from './handlers/TomorrowSubstitutionsIntentHandler';
import { NextLessonIntentHandler } from './handlers/NextLessonIntentHandler';
import { WeekScheduleIntentHandler } from './handlers/WeekScheduleIntentHandler';
import { TomorrowCancelledIntentHandler } from './handlers/TomorrowCancelledIntentHandler';
import { WeekCancelledIntentHandler } from './handlers/WeekCancelledIntentHandler';
import { HelpIntentHandler } from './handlers/HelpIntentHandler';
import { CancelStopIntentHandler } from './handlers/CancelStopIntentHandler';

/**
 * SessionEndedRequest Handler
 */
const SessionEndedRequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput: HandlerInput): Response {
    const request = handlerInput.requestEnvelope.request as SessionEndedRequest;
    console.log(`Session ended with reason: ${request.reason}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

/**
 * Global Error Handler
 */
const ErrorHandler: AlexaErrorHandler = {
  canHandle(): boolean {
    return true;
  },
  handle(handlerInput: HandlerInput, error: Error): Response {
    console.error('Error handled:', error);

    const speakOutput = 'Entschuldigung, es gab ein Problem. Bitte versuche es später erneut.';

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

/**
 * Lambda Handler Export
 */
export const handler = SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    TodayScheduleIntentHandler,
    TomorrowScheduleIntentHandler,
    SubstitutionsIntentHandler,
    TomorrowSubstitutionsIntentHandler,
    NextLessonIntentHandler,
    WeekScheduleIntentHandler,
    TomorrowCancelledIntentHandler,
    WeekCancelledIntentHandler,
    HelpIntentHandler,
    CancelStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
