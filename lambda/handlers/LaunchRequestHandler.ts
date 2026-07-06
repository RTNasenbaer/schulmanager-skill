/**
 * LaunchRequest Handler
 * Wird aufgerufen wenn der Skill geöffnet wird
 */

import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';
import { apiClient } from '../services/apiClient.service';

export const LaunchRequestHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },

  async handle(handlerInput: HandlerInput): Promise<Response> {
    const alexaUserId = handlerInput.requestEnvelope.context.System.user.userId;

    try {
      const pairingSession = await apiClient.resolvePairingSession(alexaUserId);

      if (pairingSession.linkedUserId) {
        handlerInput.attributesManager.setSessionAttributes({
          linkedUserId: pairingSession.linkedUserId,
        });

        return handlerInput.responseBuilder
          .speak(
            'Willkommen zurück beim Schulmanager! Du kannst mich nach deinem Stundenplan oder Vertretungen fragen. Was möchtest du wissen?'
          )
          .reprompt('Frage mich zum Beispiel: Was habe ich heute? Oder: Gibt es Vertretungen?')
          .getResponse();
      }

      const createdSession = await apiClient.createPairingSession(alexaUserId);

      return handlerInput.responseBuilder
        .speak(
          `Willkommen beim Schulmanager! Dein Pairing-Code lautet ${createdSession.code}. ` +
            'Öffne das Dashboard und trage diesen Code ein, um dein Konto zu verbinden. ' +
            'Danach kann ich dir deinen Stundenplan und Vertretungen ansagen.'
        )
        .reprompt('Sobald der Code im Dashboard verbunden ist, frage mich einfach nach deinem Stundenplan.')
        .getResponse();
    } catch (error) {
      console.error('LaunchRequest error:', error);

      return handlerInput.responseBuilder
        .speak('Willkommen beim Schulmanager! Ich konnte die Verbindung gerade nicht prüfen. Bitte versuche es später noch einmal.')
        .reprompt('Du kannst es später erneut versuchen.')
        .getResponse();
    }
  },
};
