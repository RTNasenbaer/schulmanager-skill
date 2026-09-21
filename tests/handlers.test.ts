import { HandlerInput } from 'ask-sdk-core';
import { apiClient } from '../lambda/services/apiClient.service';
import { LaunchRequestHandler } from '../lambda/handlers/LaunchRequestHandler';
import { TodayScheduleIntentHandler } from '../lambda/handlers/TodayScheduleIntentHandler';

jest.mock('../lambda/services/apiClient.service', () => ({
  apiClient: {
    createPairingSession: jest.fn(),
    resolvePairingSession: jest.fn(),
    getTodayTimetable: jest.fn(),
  },
}));

const mockedApiClient = jest.mocked(apiClient);

function createHandlerInput(
  request: Record<string, unknown>,
  sessionAttributes: Record<string, unknown> = {},
): HandlerInput {
  const responseBuilder = {
    speak: jest.fn().mockReturnThis(),
    reprompt: jest.fn().mockReturnThis(),
    getResponse: jest.fn(() => ({ outputSpeech: { type: 'SSML', ssml: '<speak>test</speak>' } })),
  };

  return {
    requestEnvelope: {
      request,
      context: { System: { user: { userId: 'alexa-user' } } },
    },
    attributesManager: {
      getSessionAttributes: () => sessionAttributes,
      setSessionAttributes: jest.fn(),
    },
    responseBuilder,
  } as unknown as HandlerInput;
}

describe('Alexa handlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('stores the linked user and welcomes a paired Alexa user', async () => {
    mockedApiClient.resolvePairingSession.mockResolvedValue({
      alexaUserId: 'alexa-user',
      linkedUserId: 'linked-user',
    });
    const handlerInput = createHandlerInput({ type: 'LaunchRequest' });

    const response = await LaunchRequestHandler.handle(handlerInput);

    expect(handlerInput.attributesManager.setSessionAttributes).toHaveBeenCalledWith({
      linkedUserId: 'linked-user',
    });
    expect(response.outputSpeech).toBeDefined();
    expect(mockedApiClient.createPairingSession).not.toHaveBeenCalled();
  });

  it('speaks the pairing code for an unpaired Alexa user', async () => {
    mockedApiClient.resolvePairingSession.mockResolvedValue({
      alexaUserId: 'alexa-user',
      linkedUserId: null,
    });
    mockedApiClient.createPairingSession.mockResolvedValue({ code: 'ABC234' });
    const handlerInput = createHandlerInput({ type: 'LaunchRequest' });

    await LaunchRequestHandler.handle(handlerInput);

    expect(mockedApiClient.createPairingSession).toHaveBeenCalledWith('alexa-user');
    expect(handlerInput.responseBuilder.speak).toHaveBeenCalledWith(
      expect.stringContaining('ABC234'),
    );
  });

  it('passes the linked user to timetable requests and handles an empty day', async () => {
    mockedApiClient.getTodayTimetable.mockResolvedValue({ lessons: [] });
    const handlerInput = createHandlerInput(
      { type: 'IntentRequest', intent: { name: 'TodayScheduleIntent' } },
      { linkedUserId: 'linked-user' },
    );

    await TodayScheduleIntentHandler.handle(handlerInput);

    expect(mockedApiClient.getTodayTimetable).toHaveBeenCalledWith('linked-user');
    expect(handlerInput.responseBuilder.speak).toHaveBeenCalledWith(
      'Für heute sind keine Stunden eingetragen.',
    );
  });

  it('speaks a retry message when the backend is unavailable', async () => {
    mockedApiClient.getTodayTimetable.mockRejectedValue(new Error('BACKEND_SLEEPING'));
    const handlerInput = createHandlerInput(
      { type: 'IntentRequest', intent: { name: 'TodayScheduleIntent' } },
      { linkedUserId: 'linked-user' },
    );

    await TodayScheduleIntentHandler.handle(handlerInput);

    expect(handlerInput.responseBuilder.speak).toHaveBeenCalledWith(
      expect.stringContaining('startet gerade'),
    );
  });
});