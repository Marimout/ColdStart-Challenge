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

    const rewardRequest = {
      value: req.body.value
    };

    await personalizerClient.events.reward(req.body.eventId, rewardRequest);

    context.res.status(204).send();
  } catch (error) {
    console.error(error);
    context.res.status(500).send(error);
  }
};
