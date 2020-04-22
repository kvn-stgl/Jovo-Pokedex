'use strict';
const { App, Util } = require('jovo-framework');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { Alexa } = require('jovo-platform-alexa');

jest.setTimeout(1000);

const conversationConfig = { locale: 'keys-only' };

for (const p of [new Alexa(), new GoogleAssistant()]) {
    const testSuite = p.makeTestSuite();

    describe(`PLATFORM: ${p.constructor.name} INTENTS` , () => {
        test('Launch "LAUNCH" Intent should return a welcome message and ask for the pokemon', async () => {
            const conversation = testSuite.conversation(conversationConfig);

            const launchRequest = await testSuite.requestBuilder.launch();
            const responseLaunchRequest = await conversation.send(launchRequest);

            expect(responseLaunchRequest.getSpeech()).toMatch('welcome.message')
            expect(responseLaunchRequest.getReprompt()).toMatch('welcome.question')

        });

        test('Launches PokedexNumberIntent without number should ask for number', async () => {
            const pokedexNumberIntentRequest = await testSuite.requestBuilder.intent('PokedexNumberIntent');

            const conversation = testSuite.conversation(conversationConfig);
            const responseLaunchRequest = await conversation.send(pokedexNumberIntentRequest);

            expect(responseLaunchRequest.getSpeech()).toMatch('provide_pokemon_number')
            expect(responseLaunchRequest.getReprompt()).toMatch('provide_pokemon_number')
        });

        test('Launches PokedexNumberIntent with number 1 should return pokemon name and description question', async () => {
            const pokedexNumberIntentRequest = await testSuite.requestBuilder.intent('PokedexNumberIntent', { number: 1 });

            const conversation = testSuite.conversation(conversationConfig);
            const responseLaunchRequest = await conversation.send(pokedexNumberIntentRequest);

            expect(responseLaunchRequest.getSpeech()).toMatch('pokemon_position_name pokemon_description_question')
            expect(responseLaunchRequest.getReprompt()).toMatch('pokemon_description_question')
        });

    });
}
