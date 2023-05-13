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
  console.log("publish");
  // if (client) {
  //   console.log(
  //     "Client Publish |",
  //     "ClientID:",
  //     client?.id, 
  //     "|",
  //     "Topic:",
  //     packet.topic,
  //     "|",
  //     "Payload:",
  //     packet.payload.toString()
  //   );
  // }
});

aedes.on("subscribe", function (subscriptions, client) {
  // console.log(
  //   "Client Subscribe |",
  //   "ClientID:",
  //   client?.id,
  //   "|",
  //   "Topic:",
  //   subscriptions[0].topic
  // );
});

module.exports = aedes;
