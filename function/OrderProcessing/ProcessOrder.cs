using System;
using ColdStart.Data;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;

namespace processOrder
{
    public static class ProcessOrder
    {
        [FunctionName("processOrder")]
        public static async System.Threading.Tasks.Task RunAsync([TimerTrigger("0 */1 * * * *")]TimerInfo myTimer, ILogger log)
        {
            log.LogInformation($"C# Timer trigger function executed at: {DateTime.Now}");

            string EndpointUri = Environment.GetEnvironmentVariable("CosmosDbEndpointUri");
            string PrimaryKey = Environment.GetEnvironmentVariable("CosmosDbPrimaryKey");

            CosmosClient cosmosClient;
            Database database;
            Container container;

            string databaseId = "coldstartdb";
            string containerId = "order";

            cosmosClient = new CosmosClient(EndpointUri, PrimaryKey);
            database = await cosmosClient.CreateDatabaseIfNotExistsAsync(databaseId);
            container = await database.CreateContainerIfNotExistsAsync(containerId, "/id");

            var sqlQueryText = "SELECT * FROM c";

            Console.WriteLine("Running query: {0}\n", sqlQueryText);

            QueryDefinition queryDefinition = new QueryDefinition(sqlQueryText);
            FeedIterator<Order> queryResultSetIterator = container.GetItemQueryIterator<Order>(queryDefinition);

            while (queryResultSetIterator.HasMoreResults)
            {
                FeedResponse<Order> currentResultSet = await queryResultSetIterator.ReadNextAsync();
                foreach (var order in currentResultSet)
                {
                    if (order.Status == "Accepted")
                    {
                        Console.WriteLine("\tRead {0}\n", order);
                        order.DeliveryPostition = "47.678756,-122.121034";
                        order.Status = "Ready";

                        ItemResponse<Order> itemResponse = await container.UpsertItemAsync<Order>(order);
                        Console.WriteLine("Update item in database with id: {0} Operation consumed {1} RUs.\n", itemResponse.Resource.Id, itemResponse.RequestCharge);
                    }
                }
            }
        }
    }
}
