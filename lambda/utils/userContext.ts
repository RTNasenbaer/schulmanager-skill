import { HandlerInput } from 'ask-sdk-core';

type SessionAttributes = Record<string, unknown> & {
  linkedUserId?: string;
};

export function resolveSkillUserId(handlerInput: HandlerInput): string {
  const sessionAttributes = handlerInput.attributesManager.getSessionAttributes() as SessionAttributes;
  return sessionAttributes.linkedUserId || handlerInput.requestEnvelope.context.System.user.userId;
}