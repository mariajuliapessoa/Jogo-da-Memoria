import { useGame } from '../hooks/useGame';
import { Placar } from '../components/Placar/Placar';
import { Tabuleiro } from '../components/Tabuleiro/Tabuleiro';
import { Historico } from '../components/Historico/Historico';
import styles from './Jogo.module.css';

export function Jogo() {
  const {
    estado,
    isMinhaVez,
    meuSocketId,
    erro,
    virarCarta,
  } = useGame();

  if (!estado) return <p>Carregando...</p>;

  const { cartas, jogadores, jogadorAtualIndex, historico, tamanho } = estado;
  const nomeAtual = jogadores[jogadorAtualIndex]?.nome;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.titulo}>Jogo da Memória</h1>

        {erro && <p className={styles.erro}>{erro}</p>}

        {/* Usa meuSocketId do estado React, não socket.id diretamente */}
        <Placar
          jogadores={jogadores}
          jogadorAtualIndex={jogadorAtualIndex}
          meuSocketId={meuSocketId}
        />

        <div className={styles.turno}>
          Turno de: <strong>{nomeAtual}</strong>
          {isMinhaVez
            ? <span className={styles.suaVez}> — sua vez!</span>
            : <span className={styles.aguarda}> — aguarde...</span>
          }
        </div>

        <Tabuleiro
          cartas={cartas}
          onCardClick={virarCarta}
          desabilitado={!isMinhaVez}
          tamanho={tamanho}
        />

        <Historico historico={historico} />
      </div>
    </div>
  );
}
