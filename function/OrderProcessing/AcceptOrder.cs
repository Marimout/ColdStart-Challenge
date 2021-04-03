using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Queue;
using Newtonsoft.Json.Linq;
using ColdStart.Data;

namespace ColdStart.Function
{
    public static class AcceptOrder
    {
        private static Dictionary<int, Icecream> _icecreams = null;
        public static Dictionary<int, Icecream> IcecreamFactory
        {
            get
            {
                if (_icecreams == null)
                {
                    _icecreams = new Dictionary<int, Icecream>();

                    string connString = Environment.GetEnvironmentVariable("SqlConnectionString");

                    using (var conn = new SqlConnection(connString))
                    {
                        conn.Open();

                        using (var command = new SqlCommand("SELECT * FROM [dbo].[Icecreams]", conn))
                        {
                            var reader = command.ExecuteReader();
                            while (reader.Read())
                            {
                                var id = reader.GetInt32(0);
                                _icecreams.Add(id, new Icecream
                                {
                                    IcecreamId = id,
                                    Name = reader["Name"].ToString(),
                                    Description = reader["Description"].ToString(),
                                    ImageUrl = reader["ImageUrl"].ToString()
                                });
                            }
                            reader.Close();
                        }
                    }
                }

                return _icecreams;
            }
        }
        [FunctionName("acceptOrder")]
        public static async System.Threading.Tasks.Task RunAsync([QueueTrigger("preorders", Connection = "coldstartorders_STORAGE")] CloudQueueMessage queueMessage, ILogger log)
        {
            log.LogInformation($"C# Queue trigger function processed: {queueMessage}");

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

            var jsonContent = JObject.Parse(queueMessage.AsString);

            foreach (var icecream in jsonContent["Icecreams"])
            {
                var order = new Order
                {
                    Id = Guid.NewGuid().ToString(),
                    User = jsonContent["User"].Value<string>(),
                    Date = jsonContent["Date"].Value<DateTime>(),
                    Icecream = IcecreamFactory[icecream["Id"].Value<int>()],
                    Status = "Accepted",
                    Driver = new Driver(),
                    FullAddress = jsonContent["FullAddress"].Value<string>(),
                };

                ItemResponse<Order> orderResponse = await container.CreateItemAsync<Order>(order, new PartitionKey(order.Id));

                // Note that after creating the item, we can access the body of the item with the Resource property off the ItemResponse. We can also access the RequestCharge property to see the amount of RUs consumed on this request.
                Console.WriteLine("Created item in database with id: {0} Operation consumed {1} RUs.\n", orderResponse.Resource.Id, orderResponse.RequestCharge);
            }
        }
    }
}
