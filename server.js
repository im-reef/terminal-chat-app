const net = require('net');
const clients = [];

const server = net.createServer((socket) => {
  const clientIP = socket.remoteAddress.replace('::ffff:', '');
  console.log(`🟢 New connection from ${clientIP}`);
  socket.write(`Welcome! You are connected from ${clientIP}\n`);

  clients.push({ socket, ip: clientIP });

  socket.on('data', (data) => {
    const message = data.toString().trim();
    const fullMessage = `[${clientIP}] says: ${message}\n`;

    // Broadcast to other clients
    clients.forEach(client => {
      if (client.socket !== socket) {
        client.socket.write(fullMessage);
      }
    });

    process.stdout.write(fullMessage);
  });

  socket.on('end', () => {
    console.log(`🔴 ${clientIP} disconnected`);
    const index = clients.findIndex(client => client.socket === socket);
    if (index !== -1) clients.splice(index, 1);
  });

  socket.on('error', (err) => {
    console.error(`⚠️ Error with ${clientIP}:`, err.message);
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`TCP Chat Server running on port ${PORT}`);
});
