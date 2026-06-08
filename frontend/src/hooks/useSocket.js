import { useEffect } from 'react';
import socket from '../socket/socketClient';
import { useGameDispatch } from '../context/GameContext';

export function useSocket() {
  const dispatch = useGameDispatch();

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      dispatch({ type: 'SET_MEU_ID', id: socket.id });
    });

    socket.on('sala_criada', ({ roomId }) => {
      dispatch({ type: 'SET_MEU_ID', id: socket.id });
      dispatch({ type: 'SALA_CRIADA', roomId });
    });

    socket.on('jogo_iniciado', ({ estado, roomId }) => {
      const meuSocketIdAtual = socket.id;
      const meuIndex = estado.jogadores.findIndex(
        j => j.socketId === meuSocketIdAtual
      );
      dispatch({
        type: 'JOGO_INICIADO_COMPLETO',
        estado,
        meuIndex: meuIndex >= 0 ? meuIndex : 0,
        meuSocketId: meuSocketIdAtual,
        // roomId vem do backend, ou extrai do estado se não vier
        roomId: roomId ?? estado.roomId,
      });
    });

    socket.on('estado_atualizado', ({ estado }) => {
      dispatch({ type: 'ATUALIZAR_ESTADO', estado });
    });

    socket.on('par_verificado', ({ estado }) => {
      dispatch({ type: 'ATUALIZAR_ESTADO', estado });
    });

    socket.on('jogo_encerrado', ({ estado, vencedor }) => {
      dispatch({ type: 'JOGO_ENCERRADO', estado, vencedor });
    });

    socket.on('jogo_reiniciado', ({ estado }) => {
      dispatch({ type: 'JOGO_REINICIADO', estado });
    });

    socket.on('voto_reinicio', ({ votos }) => {
      dispatch({ type: 'VOTO_REINICIO', votos });
    });

    socket.on('oponente_desconectou', ({ mensagem }) => {
      dispatch({ type: 'SET_ERRO', mensagem });
    });

    socket.on('erro', ({ mensagem }) => {
      dispatch({ type: 'SET_ERRO', mensagem });
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [dispatch]);
}
