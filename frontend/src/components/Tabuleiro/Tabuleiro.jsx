import { Carta } from '../Carta/Carta';
import styles from './Tabuleiro.module.css';

export function Tabuleiro({ cartas, onCardClick, desabilitado, tamanho = 4 }) {
  if (!cartas || cartas.length === 0) return null;

  const linhas = [];
  for (let i = 0; i < tamanho; i++) {
    linhas.push(cartas.slice(i * tamanho, (i + 1) * tamanho));
  }

  return (
    <div className={styles.container}>
      <table className={styles.tabela}>
        <tbody>
          {linhas.map((linha, i) => (
            <tr key={i}>
              {linha.map(carta => (
                <td key={carta.id} className={styles.celula}>
                  <Carta
                    carta={carta}
                    onClick={onCardClick}
                    desabilitada={desabilitado}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
