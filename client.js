const net = require('net');
const readline = require('readline');
const os = require('os');

// Get local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (let iface in interfaces) {
    for (let config of interfaces[iface]) {
      if (config.family === 'IPv4' && !config.internal) {
        return config.address;
      }
    }
  }
  return 'Unknown';
}

const client = net.createConnection({ port: 5000, host: '192.168.100.105' }, () => {
  console.log(`Connected to server as ${getLocalIP()}`);
});

client.on('data', (data) => {
  process.stdout.write(data.toString());
});

client.on('end', () => {
  console.log('Disconnected from server');
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: ''
});

rl.on('line', (line) => {
  client.write(line);
});
