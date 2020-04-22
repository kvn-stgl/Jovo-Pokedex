'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
const Pokedex = require('pokedex-promise-v2');

const app = new App();

app.use(
    new Alexa(),
    new GoogleAssistant(),
    new JovoDebugger(),
    new FileDb()
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    LAUNCH() {},
    PokedexNumberIntent() {},
    PokedexNameIntent() {},

    DescriptionState: {
        YesIntent() {},
        NoIntent() {},
        Unhandled() {}
    },

    ContinueState: {
        YesIntent() {},
        NoIntent() {},
        Unhandled() {}
    },

    Unhandled() {},

    END() {},
});

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

module.exports.app = app;
