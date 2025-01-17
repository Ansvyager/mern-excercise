const amqp = require('amqplib');

const connect = async () => {
  try {
    const connection = await amqp.connect(`amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@${process.env.RABBITMQ_DEFAULT_HOST}:${process.env.RABBITMQ_DEFAULT_PORT}`);
    const channel = await connection.createChannel();
    console.log("RabbitMQ Connected...");
    return channel;
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const consume = async (socket) => {
  try {
    connect().then(channel => {
      channel.assertQueue('notification', { durable: false });
      channel.consume('notification', msg => {
        console.log('- Received', msg.content.toString());
        socket.emit('notification', msg.content.toString());
      }, { noAck: true });
    });
    console.log("RabbitMQ Consume...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = {
  connect: connect,
  consume: consume
}
