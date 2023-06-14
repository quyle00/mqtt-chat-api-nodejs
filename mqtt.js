const aedes = require("aedes")();
const { Users } = require("./models");

aedes.on("client", function (client) {
  console.log("Client Connect |", "ClientID:", client.id);
});

aedes.on("clientDisconnect", function (client) {
  console.log("client disconnect");
});

aedes.on("publish", async function (packet, client) {
  // if (client) {
  //   console.log(
  //     "MQTT",
  //     "Publish",
  //     "Topic:",
  //     packet.topic,
  //     "Retain:",
  //     packet.retain,
  //     "Payload:",
  //     packet.payload.toString()
  //   );
  // }

  const topicRegex = packet.topic.split("/");
  if (
    topicRegex.length >= 3 &&
    topicRegex[0] === "user" &&
    topicRegex[2] === "status"
  ) {
    let buff = Buffer.from(packet?.payload);
    let jsonData = null;
    try {
      jsonData = JSON.parse(buff.toString());
      await Users.updateData(jsonData._id, {
        isOnline: jsonData.isOnline,
        lastSeen: jsonData.lastSeen,
      });
    } catch (e) {
      console.log(buff);
      console.log("Parse fail");
    }
  }
});

aedes.on("subscribe", function (subscriptions, client) {
  console.log("MQTT", "Subscribe", "Topic:", subscriptions[0].topic);
});

aedes.on("unsubscribe", function (subscriptions, client) {
  console.log("MQTT", "Unsubscribe", "Topic:", subscriptions[0].topic);
});

module.exports = aedes;
