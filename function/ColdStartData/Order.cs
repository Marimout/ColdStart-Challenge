using System;
using Newtonsoft.Json;

namespace ColdStart.Data
{
    public class Order
    {
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }
        public string User { get; set; }
        public DateTime Date { get; set; }
        public Icecream Icecream { get; set; }
        public string Status { get; set; }
        public Driver Driver { get; set; }
        public string FullAddress { get; set; }
        public string DeliveryPostition { get; set; }
        public string LastPosition { get; set; }
        public override string ToString()
        {
            return JsonConvert.SerializeObject(this);
        }
    }
}
