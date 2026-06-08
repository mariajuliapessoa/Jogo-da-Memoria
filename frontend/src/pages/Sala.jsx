import { useGame } from '../hooks/useGame';
import styles from './Sala.module.css';

export function Sala() {
  const { roomId } = useGame();

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.titulo}>Aguardando oponente...</h1>
        <p className={styles.descricao}>
          Compartilhe o código abaixo com seu oponente:
        </p>
        <div className={styles.codigoBox}>
          <span className={styles.codigo}>{roomId}</span>
        </div>
        <button
          className={styles.copiar}
          onClick={() => navigator.clipboard?.writeText(roomId)}
        >
          📋 Copiar código
        </button>
        <div className={styles.spinner} />
      </div>
    </div>
  );
}
