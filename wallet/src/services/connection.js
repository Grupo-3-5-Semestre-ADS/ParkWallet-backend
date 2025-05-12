import amqp from "amqplib";

export default async (queue, exchange, routingKey, callback) => {
  const host = process.env.RABBITMQ_HOST || 'rabbitmq';
  const port = process.env.RABBITMQ_PORT || '5672';
  const user = process.env.RABBITMQ_USER || 'guest';
  const pass = process.env.RABBITMQ_PASS || 'guest';

  const MAX_RETRIES = parseInt(process.env.MAX_RETRIES);

  try {
    const connection = await amqp.connect(`amqp://${user}:${pass}@${host}:${port}`);
    const channel = await connection.createChannel();

    process.once("SIGINT", async () => {
      await channel.close();
      await connection.close();
    });

    await channel.assertExchange(exchange, "direct", { durable: true });

    await channel.assertQueue(queue, { durable: true });
    await channel.assertQueue(`${queue}_dlq`, { durable: true });

    await channel.bindQueue(queue, exchange, routingKey);
    await channel.bindQueue(`${queue}_dlq`, exchange, "dlq");

    await channel.consume(
      queue,
      (message) => {
        const content = message.content.toString();
        const retries = message.properties.headers?.["x-retries"] || 0;

        try {
          callback(JSON.parse(content));
        } catch (err) {
          if (retries < MAX_RETRIES) {
            channel.sendToQueue(queue, Buffer.from(content), {
              headers: { "x-retries": retries + 1},
              persistent: true,
            });
          } else {
            console.log("====> Mensagem enviada para DLQ!");
            channel.publish(exchange, "dlq", Buffer.from(content), {
              headers: { "x-retries": retries },
              persistent: true,
            });
          }
        } finally {
          channel.ack(message);
        }
      },
      { noAck: false }
    );
  } catch (err) {
    console.error(err);
  }
}
