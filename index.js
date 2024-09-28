const http = require('http');
const WebSocket = require('ws');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

let clients = [];

wss.on('connection', (ws) => {
  clients.push(ws);

  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message);
    if (parsedMessage.type === 'editStatus') {
      broadcastEditStatus(parsedMessage.contactId, parsedMessage.isEditing);
    }
  });

  ws.on('close', () => {
    clients = clients.filter(client => client !== ws);
  });
});

function broadcastEditStatus(contactId, isEditing) {
  const message = JSON.stringify({ type: 'editStatus', contactId, isEditing });
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

server.listen(8080, () => {
  console.log('WebSocket server is running on port 8080');
});