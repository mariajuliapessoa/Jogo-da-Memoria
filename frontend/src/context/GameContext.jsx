import { createContext, useContext, useReducer } from 'react';

const estadoInicial = {
  tela: 'lobby',
  roomId: null,
  meuSocketId: null,
  meuIndex: null,
  estado: null,
  vencedor: null,
  erro: null,
  votosReinicio: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_MEU_ID':
      return { ...state, meuSocketId: action.id };

    case 'SALA_CRIADA':
      return { ...state, tela: 'sala', roomId: action.roomId, meuIndex: 0 };

    case 'JOGO_INICIADO_COMPLETO':
      return {
        ...state,
        tela: 'jogo',
        estado: action.estado,
        meuIndex: action.meuIndex,
        meuSocketId: action.meuSocketId,
        // CORREÇÃO: salva o roomId aqui também — o jogador 2 nunca passa
        // por SALA_CRIADA, então roomId ficava null e virarCarta bloqueava
        roomId: action.roomId,
        erro: null,
      };

    case 'ATUALIZAR_ESTADO':
      return { ...state, estado: action.estado };

    case 'JOGO_ENCERRADO':
      return { ...state, tela: 'resultado', estado: action.estado, vencedor: action.vencedor };

    case 'JOGO_REINICIADO':
      return { ...state, tela: 'jogo', estado: action.estado, vencedor: null, votosReinicio: 0 };

    case 'VOTO_REINICIO':
      return { ...state, votosReinicio: action.votos };

    case 'SET_ERRO':
      return { ...state, erro: action.mensagem };

    case 'LIMPAR_ERRO':
      return { ...state, erro: null };

    default:
      return state;
  }
}

const GameContext = createContext(null);
const DispatchContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, estadoInicial);
  return (
    <GameContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </GameContext.Provider>
  );
}

export function useGameState() {
  return useContext(GameContext);
}

export function useGameDispatch() {
  return useContext(DispatchContext);
}
