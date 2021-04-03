const { getUser } = require('../shared/user-utils');
const { config} = require('../shared/config');
const { QueueClient, QueueServiceClient } = require("@azure/storage-queue");

module.exports = async function (context, req) {
  // Get the user details from the request
  const user = getUser(req);

  // TODO: add the pre-order JSON document in a queue
  const queueServiceClient = QueueServiceClient.fromConnectionString(config.azure_storage_connectionstring);
  const queueClient = queueServiceClient.getQueueClient('preorders');

  const base64Encode = (str) => Buffer.from(str).toString('base64')

  await queueClient.sendMessage(base64Encode(JSON.stringify(req.body)));

  context.res.status(201);
};
