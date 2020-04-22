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
    LAUNCH() {
        const question = this.t('welcome.question')
        const message = this.t('welcome.message')
        this.ask(message, question);
    },

    async PokedexNumberIntent() {
        const number = this.$inputs.number

        if (!number || !number.value) {
            this.ask(this.t('provide_pokemon_number'))
            return
        }

        const P = new Pokedex();

        let response;
        try {
            response = await P.getPokemonByName(number.value);
        } catch (error) {
            console.error("Error getPokemonByName", error);
            if (error.response && error.response.status == 404) {
                this.ask(this.t("pokemon_not_found"), this.t('welcome.question'));
            }
            else {
                this.ask(this.t("error"), this.t('welcome.question'));
            }

            return; // Stop here
        }

        // console.log("Pokedex Response", response)
        //Save the pokemon number to a session variable
        this.$session.$data.pokemonNumber = response.id
        this.$session.$data.pokemonImage = response.sprites.front_default

        const description = this.t("pokemon_position_name", { name: response.name, position: response.id })
        const reprompt = this.t("pokemon_description_question", { name: response.name });

        const speech = description + " " + reprompt;

        this.followUpState('DescriptionState')
            .showImageCard(response.name, description, response.sprites.front_d1efault)
            .ask(speech, reprompt);

    },

    async PokedexNameIntent() {
        const name = this.$inputs.pokemon.value

        if (!name) {
            this.ask(this.t('wrong_pokemon_name'))
            return
        }

        console.log(name)
        const P = new Pokedex();

        let response;
        try {
            response = await P.getPokemonByName(name);
        } catch (error) {
            console.error("Error getPokemonByName", error);
            if (error.response && error.response.status == 404) {
                this.ask(this.t("pokemon_not_found"), this.t('welcome.question'));
            }
            else {
                this.ask(this.t("error"), this.t('welcome.question'));
            }

            return;
        }

        // Save the pokemon number to a session variable
        this.$session.$data.pokemonNumber = response.id
        this.$session.$data.pokemonImage = response.sprites.front_default

        const description = this.t("pokemon_at_position", { name: response.name, position: response.id })
        const reprompt = this.t("pokemon_description_question", { name: response.name });

        const speech = description + " " + reprompt;

        this.followUpState('DescriptionState')
            .showImageCard(response.name, description, response.sprites.front_default)
            .ask(speech, reprompt);
    },

    DescriptionState: {
        async YesIntent() {
            const P = new Pokedex();
            const lang = this.t('lang');
            const number = this.$session.$data.pokemonNumber;
            const img = this.$session.$data.pokemonImage;
            const followupQuestion = this.t("another_pokemon_question");

            try {
                response = await P.getPokemonSpeciesByName(number) // with Promise
                const dexEntry = response.flavor_text_entries.filter(function (entry) {
                    return (entry.language.name === lang);
                });

                const description = dexEntry[getRandomInt(dexEntry.length - 1)].flavor_text.replace(/[\x00-\x1F\x7F-\x9F]/g, " ");
                this.followUpState('ContinueState')
                    .showImageCard(response.name, description, img)
                    .ask(`${response.name}: ${description} ${followupQuestion}`);
            } catch (error) {
                console.error(error);
                this.tell(this.t("error"));
            }
        },
        NoIntent() {
            this.followUpState('ContinueState').ask(this.t("another_pokemon_question"));
        },
        Unhandled() {
            const reprompt = this.t('answer_yes_no');
            this.ask(reprompt, reprompt);
        }
    },

    ContinueState: {
        YesIntent() {
            this.removeState().ask(this.t("welcome.question"));
        },
        NoIntent() {
            this.tell(this.t('goodbye'));
        },
        Unhandled() {
            const reprompt = this.t('answer_yes_no');
            this.ask(reprompt, reprompt);
        }
    },

    Unhandled() {
        return this.toIntent('LAUNCH');
    },

    END() {
        let reason = this.$alexaSkill.getEndReason();

        console.log("End Reason", reason);

        this.tell(this.t('goodbye'));
    },
});

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

module.exports.app = app;
