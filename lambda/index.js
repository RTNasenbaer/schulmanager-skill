"use strict";
/**
 * Alexa Skill Entry Point
 * Lambda Handler für den Schulmanager Alexa Skill
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const ask_sdk_core_1 = require("ask-sdk-core");
// Import Handlers
const LaunchRequestHandler_1 = require("./handlers/LaunchRequestHandler");
const TodayScheduleIntentHandler_1 = require("./handlers/TodayScheduleIntentHandler");
const TomorrowScheduleIntentHandler_1 = require("./handlers/TomorrowScheduleIntentHandler");
const SubstitutionsIntentHandler_1 = require("./handlers/SubstitutionsIntentHandler");
const NextLessonIntentHandler_1 = require("./handlers/NextLessonIntentHandler");
const HelpIntentHandler_1 = require("./handlers/HelpIntentHandler");
const CancelStopIntentHandler_1 = require("./handlers/CancelStopIntentHandler");
/**
 * SessionEndedRequest Handler
 */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        console.log(`Session ended with reason: ${request.reason}`);
        return handlerInput.responseBuilder.getResponse();
    },
};
/**
 * Global Error Handler
 */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
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
exports.handler = ask_sdk_core_1.SkillBuilders.custom()
    .addRequestHandlers(LaunchRequestHandler_1.LaunchRequestHandler, TodayScheduleIntentHandler_1.TodayScheduleIntentHandler, TomorrowScheduleIntentHandler_1.TomorrowScheduleIntentHandler, SubstitutionsIntentHandler_1.SubstitutionsIntentHandler, NextLessonIntentHandler_1.NextLessonIntentHandler, HelpIntentHandler_1.HelpIntentHandler, CancelStopIntentHandler_1.CancelStopIntentHandler, SessionEndedRequestHandler)
    .addErrorHandlers(ErrorHandler)
    .lambda();
//# sourceMappingURL=index.js.map