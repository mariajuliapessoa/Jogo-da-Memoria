import styles from './Placar.module.css';

export function Placar({ jogadores, jogadorAtualIndex, meuSocketId }) {
  if (!jogadores) return null;

  return (
    <div className={styles.placar}>
      {jogadores.map((jogador, idx) => (
        <div
          key={idx}
          className={[
            styles.jogador,
            jogadorAtualIndex === idx ? styles.ativo : '',
          ].join(' ')}
        >
          <span className={styles.nome}>
            {jogador.nome}
            {jogador.socketId === meuSocketId && (
              <span className={styles.voce}> (você)</span>
            )}
          </span>
          <span className={styles.pontos}>
            Pontos: <strong>{jogador.pontos}</strong>
          </span>
        </div>
      ))}
    </div>
  );
}
