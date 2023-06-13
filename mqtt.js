const aedes = require("aedes")();
// const server = require("net").createServer(aedes.handle);
// const port = 1883;

// server.listen(port, function () {
//   console.log("server started and listening on port ", port);
// });

aedes.on("client", function (client) {
  console.log("Client Connect |", "ClientID:", client.id);
});

aedes.on("clientDisconnect", function (client) {
  console.log("client disconnect");
});

aedes.on("publish", function (packet, client) {
  if (client) {
    console.log(
      "MQTT",
      "Publish",
      "Topic:",
      packet.topic,
      "Retain:",
      packet.retain,
      "Payload:",
      packet.payload.toString()
    );
  }
});

aedes.on("subscribe", function (subscriptions, client) {
  console.log("MQTT", "Subscribe", "Topic:", subscriptions[0].topic);
});

aedes.on("unsubscribe", function (subscriptions, client) {
  console.log("MQTT", "Unsubscribe", "Topic:", subscriptions[0].topic);
});

module.exports = aedes;
