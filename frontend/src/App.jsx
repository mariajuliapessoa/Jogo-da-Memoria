import { useSocket } from './hooks/useSocket';
import { useGame } from './hooks/useGame';
import { Lobby } from './pages/Lobby';
import { Sala } from './pages/Sala';
import { Jogo } from './pages/Jogo';
import { Resultado } from './pages/Resultado';

export default function App() {
  // Registra todos os listeners do socket
  useSocket();

  const { tela } = useGame();

  if (tela === 'lobby')     return <Lobby />;
  if (tela === 'sala')      return <Sala />;
  if (tela === 'jogo')      return <Jogo />;
  if (tela === 'resultado') return <Resultado />;

  return null;
}
