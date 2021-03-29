const { config } = require('../shared/config');
const data = require('../shared/catalog-data');

const uuid = require('uuid').v4;
const Personalizer = require('@azure/cognitiveservices-personalizer');
const CognitiveServicesCredentials = require('@azure/ms-rest-azure-js').CognitiveServicesCredentials;
const readline = require('readline-sync');

// The key specific to your personalization service instance; e.g. "0123456789abcdef0123456789ABCDEF"
const serviceKey = config.azure_personalizer_key;

// The endpoint specific to your personalization service instance; 
// e.g. https://<your-resource-name>.cognitiveservices.azure.com
const baseUri = config.azure_personalizer_endpoint;

module.exports = async function (context, req) {
  try {
    const credentials = new CognitiveServicesCredentials(serviceKey);
    const personalizerClient = new Personalizer.PersonalizerClient(credentials, baseUri);

    let rankRequest = {}

    // Generate an ID to associate with the request.
    rankRequest.eventId = uuid();

    // Get context information from the user.
    const now = new Date();
    rankRequest.contextFeatures = [
      {
        "browserType": context.req.headers["user-agent"]
      },
      {
        "time": now.getHours()
      },
      {
        "weekDay": now.getDay()
      },
      {
        "loggedIn": true
      }
    ];

    // Get the actions list to choose from personalization with their features.
    icecreams = await data.getCatalog();
    rankRequest.actions = icecreams.map(i => ({
      id: `${i.Id}`,
      features: [
        { name: i.Name },
        { description: i.Description },
      ]
    }));;

    // Exclude an action for personalization ranking. This action will be held at its current position.
    rankRequest.excludedActions = [];

    rankRequest.deferActivation = false;

    console.log(rankRequest);

    // Rank the actions
    const rankResponse = await personalizerClient.rank(rankRequest);
    console.log(rankResponse);
    context.res.status(200).send(rankResponse);
  } catch (error) {
    console.error(error);
    context.res.status(500).send(error);
  }
};
