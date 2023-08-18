const aedes = require("aedes")();
const { Users, Conversation } = require("./models");
const PushNotification = require("./helper/push-notification");

aedes.on("client", function (client) {
  console.log("Client Connect |", "ClientID:", client.id);
});

aedes.on("clientDisconnect", function (client) {
  console.log("client disconnect");
});

aedes.on("publish", async function (packet, client) {
  try {
    let buff = Buffer.from(packet?.payload);
    let jsonData = null;
    try {
      jsonData = JSON.parse(buff.toString());
    } catch (e) {
      console.log("Parse payload fail");
    }

    const topicRegex = packet.topic.split("/");
    if (topicRegex.length >= 3) {
      switch (topicRegex[0]) {
        case "conversation": {
          let conversationId = topicRegex[1];
          let userId = topicRegex[2];
          let user = await Users.getByID(userId);
          if (user.deviceToken) {
            if (jsonData.type === 0 && !user.isOnline) {
              PushNotification.sendPushNotification({
                notification: {
                  title: user.fullname,
                  body: jsonData.message.content,
                },
                data: {
                  conversationId: conversationId,
                },
                deviceToken: user.deviceToken,
              });
            }
          }
          break;
        }
        case "user": {
          if (topicRegex[2] === "status") {
            try {
              await Users.updateData(jsonData._id, {
                isOnline: jsonData.isOnline,
                lastSeen: jsonData.lastSeen,
              });
            } catch (e) {
              console.log(buff);
              console.log("Parse fail");
            }
          }
          break;
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
});

aedes.on("subscribe", function (subscriptions, client) {
  console.log("MQTT", "Subscribe", "Topic:", subscriptions[0].topic);
});

aedes.on("unsubscribe", function (subscriptions, client) {
  console.log("MQTT", "Unsubscribe", "Topic:", subscriptions[0].topic);
});

module.exports = aedes;
