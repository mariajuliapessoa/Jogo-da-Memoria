import styles from './Carta.module.css';

export function Carta({ carta, onClick, desabilitada }) {
  function handleClick() {
    if (desabilitada || carta.virada || carta.acertada) return;
    onClick(carta.id);
  }

  return (
    <div
      className={[
        styles.carta,
        carta.virada || carta.acertada ? styles.virada : '',
        carta.acertada ? styles.acertou : '',
        !desabilitada && !carta.virada && !carta.acertada ? styles.clicavel : '',
      ].join(' ')}
      onClick={handleClick}
    >
      <div className={styles.inner}>
        <div className={styles.frente}>{carta.valor}</div>
        <div className={styles.verso}>?</div>
      </div>
    </div>
  );
}
