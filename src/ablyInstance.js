const Ably = require("ably");

const realtime = new Ably.Realtime.Promise({
  key: "vQNuYw.HkQlpw:3aN2tFHDm2V-ma5kFg1Hr2zQq16Mxshyz2T18okzYxQ"
});

// realtime.connection.on('connectionStateChanged', (stateChange) => {
//   console.log(`Connection state changed: ${stateChange.current}`);

//   switch (stateChange.current) {
//     case 'connected':
//       console.log('Connected to Ably!');
//       break;
//     case 'disconnected':
//       console.log('Connection disconnected.');
//       realtime.connection.connect();
//       break;
//     case 'suspended':
//       console.log('Connection suspended.');
//       realtime.connection.connect();
//       break;
//     case 'closed':
//       console.log('Connection closed.');
//       realtime.connection.connect();
//       break;
//     case 'failed':
//       console.log('Connection failed. Reconnecting...');
//       // Handle connection failure, implement reconnect logic
//       realtime.connection.connect();
//       break;
//     default:
//       console.log('Unknown connection state.');
//       realtime.connection.connect();
//   }
// });

module.exports = realtime;
