import amqp from "amqplib";
import { v4 as uuidv4 } from "uuid";


const RABBITMQ_URL = process.env.RABBITMQ || "amqp://guest:guest@rabbitmq:5672";
const exchange = "user_exchange";
const routingKey = "user.created";

export async function publishUserCreated(userData) {
  let connection;
  let channel;

  try {
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();

    await channel.assertExchange(exchange, "direct", { durable: true });

    const message = {
      eventType: "UserCreated",
      producer: "user-api",
      timestamp: new Date().toISOString(),
      correlationId: uuidv4(),
      data: userData,
    };

    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)), {
      persistent: true,
      contentType: "application/json"
    });

    console.log("✅ Mensagem publicada no RabbitMQ: ", userData.id);

  } catch (error) {
    console.error("❌ Erro ao publicar mensagem no RabbitMQ:", error);
  } finally {
    if (channel) await channel.close();
    if (connection) await connection.close();
  }
}
