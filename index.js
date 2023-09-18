const pubsub = require('./pubsub');
const { server, io } = require('./app');

const Events = require('events');
const emitter = new Events.EventEmitter();

io.on('connection', (socket) => {
  console.log('user connected: ' + socket.id);
  socket.on('chat message', (msg) => {
    console.log('user: ' + socket.id + ' sent a chat message');
    const messageSent = pubsub.publishMessage(msg);
    if (messageSent) {
      console.log('message sent to pubsub');
    }
    else {
      console.log('Error: message not sent to pubsub');
    }
  });
  emitter.on('chat message', (res) => {
    socket.emit('chat message', res.data.toString());
    console.log('user: ' + socket.id + ' received a chat message');
  });
});

pubsub.subscription.on('message', message => {
  emitter.emit('chat message', message);
  message.ack();
});

server.listen(8080, () => {
  console.log('server running at http://localhost:8080');
});

