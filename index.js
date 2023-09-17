process.env.GOOGLE_APPLICATION_CREDENTIALS = '../json-keys/learning-gcp-396121-b153d54f5c8d.json';
const topicNameOrId = 'projects/learning-gcp-396121/topics/topic-1';
const subscriptionName = 'projects/learning-gcp-396121/subscriptions/topic-1-sub';

const { join } = require('node:path');
const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const {PubSub} = require('@google-cloud/pubsub');
const Events = require('events');

const app = express();
const server = createServer(app);
const io = new Server(server);
const pubSubClient = new PubSub(); 
const subscription = pubSubClient.subscription(subscriptionName);
const emitter = new Events.EventEmitter();

async function publishMessage(topicNameOrId, data) {
  const dataBuffer = Buffer.from(data);
  try {
    const messageId = await pubSubClient
      .topic(topicNameOrId)
      .publishMessage({data: dataBuffer});
    console.log(`Message ${messageId} published.`);
  } catch (error) {
      console.error(`Received error while publishing: ${error.message}`);
      process.exitCode = 1;
  }
}
io.on('connection', (socket) => {
  console.log('user connected: ' + socket.id);
  socket.on('chat message', (msg) => {
    console.log('user: ' + socket.id + ' sent a chat message');
    publishMessage(topicNameOrId, msg);
  });
  emitter.on('chat message', (res) => {
    socket.emit('chat message', res.data.toString());
    console.log('user: ' + socket.id + ' received a chat message');
  });
});

subscription.on('message', message => {
  emitter.emit('chat message', message);
  message.ack();
});

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '/public/index.html'));
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});

