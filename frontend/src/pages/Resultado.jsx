import { useGame } from '../hooks/useGame';
import styles from './Resultado.module.css';

export function Resultado() {
  const { estado, vencedor, votosReinicio, reiniciarJogo, meuSocketId } = useGame();

  const euVenci =
    vencedor &&
    estado?.jogadores?.find(j => j.socketId === meuSocketId)?.nome === vencedor.nome;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {vencedor ? (
          <>
            <div className={styles.emoji}>🏆</div>
            <h1 className={styles.titulo}>
              {euVenci ? 'Você venceu!' : `${vencedor.nome} venceu!`}
            </h1>
            <p className={styles.pontos}>{vencedor.pontos} pares encontrados</p>
          </>
        ) : (
          <>
            <div className={styles.emoji}>🤝</div>
            <h1 className={styles.titulo}>Empate!</h1>
          </>
        )}

        {estado && (
          <div className={styles.placarFinal}>
            {estado.jogadores.map((j, i) => (
              <div key={i} className={styles.linha}>
                <span>{j.nome}</span>
                <strong>{j.pontos} pts</strong>
              </div>
            ))}
          </div>
        )}

        <button className={styles.btn} onClick={reiniciarJogo}>
          {votosReinicio > 0
            ? `Aguardando oponente... (${votosReinicio}/2)`
            : 'Jogar Novamente'}
        </button>
      </div>
    </div>
  );
}
