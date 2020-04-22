// ------------------------------------------------------------------
// JOVO PROJECT CONFIGURATION
// ------------------------------------------------------------------

module.exports = {
   alexaSkill: {
      nlu: {
         name: 'alexa',
      },
      skillId: 'amzn1.ask.skill.d437d087-b284-4f3a-802f-38f2471acfa2'
    },
   googleAction: {
      nlu: 'dialogflow',
   },
   endpoint: '${JOVO_WEBHOOK_URL}',
};
 