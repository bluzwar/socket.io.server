const pubsub = require('./pubsub');
const { server, io } = require('./app');

const Events = require('events');
const emitter = new Events.EventEmitter();

io.on('connection', (socket) => {
  console.log('user connected: ' + socket.id);
  socket.on('chat message', (msg) => {
    console.log('user: ' + socket.id + ' sent a chat message');
    pubsub.publishMessage(msg);
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

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});

