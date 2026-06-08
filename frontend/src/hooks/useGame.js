import socket from '../socket/socketClient';
import { useGameState, useGameDispatch } from '../context/GameContext';

export function useGame() {
  const state = useGameState();
  const dispatch = useGameDispatch();

  // Usa state.meuSocketId (React state) em vez de socket.id (valor externo)
  // Isso garante re-render correto quando o turno muda
  const isMinhaVez =
    state.estado !== null &&
    state.meuSocketId !== null &&
    state.estado.jogadorAtualSocketId === state.meuSocketId;

  function criarSala(nome) {
    dispatch({ type: 'LIMPAR_ERRO' });
    socket.emit('criar_sala', { nome });
  }

  function entrarSala(roomId, nome) {
    dispatch({ type: 'LIMPAR_ERRO' });
    socket.emit('entrar_sala', { roomId: roomId.toUpperCase(), nome });
  }

  function virarCarta(cardId) {
    // Também usa state.meuSocketId aqui para consistência
    const vezAtual =
      state.estado?.jogadorAtualSocketId === state.meuSocketId;
    if (!vezAtual || !state.roomId) return;
    socket.emit('virar_carta', { roomId: state.roomId, cardId });
  }

  function reiniciarJogo() {
    if (!state.roomId) return;
    socket.emit('reiniciar_jogo', { roomId: state.roomId });
  }

  return {
    ...state,
    isMinhaVez,
    criarSala,
    entrarSala,
    virarCarta,
    reiniciarJogo,
  };
}
