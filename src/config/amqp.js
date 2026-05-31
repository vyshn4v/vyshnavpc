import amqp from "amqplib";

let channel = null;

export const initializeAmqp = async () => {
  try {
    const amqpUrl = process.env.AMQP_URL || "amqp://localhost";
    const connection = await amqp.connect(amqpUrl);
    channel = await connection.createChannel();

    const queue = process.env.CONTACT_QUEUE || "contact_messages";
    await channel.assertQueue(queue, { durable: true });

    console.log("[AMQP] Connected and queue initialized");
  } catch (error) {
    console.error("[AMQP] Connection failed", error);
  }
};

export const publishContactMessage = (payload) => {
  if (!channel) {
    console.error("[AMQP] Channel not initialized, cannot publish message");
    return false;
  }
  const queue = process.env.CONTACT_QUEUE || "contact_messages";
  return channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), {
    contentType: "application/json",
    persistent: true
  });
};
