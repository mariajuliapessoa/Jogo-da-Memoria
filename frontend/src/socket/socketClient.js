import { io } from 'socket.io-client';

const socket = io('https://jogo-da-memoria-k2su.onrender.com', {
  autoConnect: false,
});

export default socket;