import { useEffect, useRef } from 'react';
import styles from './Historico.module.css';

export function Historico({ historico = [] }) {
  const listaRef = useRef(null);

  useEffect(() => {
    if (listaRef.current) {
      listaRef.current.scrollTop = listaRef.current.scrollHeight;
    }
  }, [historico.length]);

  return (
    <div className={styles.container}>
      <h2 className={styles.titulo}>Histórico de Jogadas</h2>
      <ul className={styles.lista} ref={listaRef}>
        {historico.length === 0 && (
          <li className={styles.vazio}>Nenhuma jogada ainda.</li>
        )}
        {historico.map((entrada, i) => (
          <li key={i} className={styles.item}>
            <strong>{entrada.jogador}</strong> virou [{entrada.valores.join(', ')}]{' '}
            → {entrada.resultado ? '✅ ACERTO' : '❌ ERRO'}
          </li>
        ))}
      </ul>
    </div>
  );
}
