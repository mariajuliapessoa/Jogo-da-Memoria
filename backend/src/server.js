const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const registrarHandlers = require('./socket/handlers');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*' },
});

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

io.on('connection', (socket) => {
  console.log(`[+] Conectado: ${socket.id}`);
  registrarHandlers(io, socket);
  socket.on('disconnect', () => {
    console.log(`[-] Desconectado: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
