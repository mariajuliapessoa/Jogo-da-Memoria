import { useState } from 'react';
import { useGame } from '../hooks/useGame';
import styles from './Lobby.module.css';

export function Lobby() {
  const { criarSala, entrarSala, erro } = useGame();
  const [nome, setNome] = useState('');
  const [roomIdInput, setRoomIdInput] = useState('');
  const [modo, setModo] = useState(null); // 'criar' | 'entrar'

  function handleCriar(e) {
    e.preventDefault();
    if (nome.trim()) criarSala(nome.trim());
  }

  function handleEntrar(e) {
    e.preventDefault();
    if (nome.trim() && roomIdInput.trim()) {
      entrarSala(roomIdInput.trim(), nome.trim());
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.titulo}>Jogo da Memória</h1>
        <p className={styles.subtitulo}>Multiplayer</p>

        {erro && <p className={styles.erro}>{erro}</p>}

        {!modo && (
          <div className={styles.opcoes}>
            <button className={styles.btn} onClick={() => setModo('criar')}>
              Criar Sala
            </button>
            <button className={styles.btnSecundario} onClick={() => setModo('entrar')}>
              Entrar em Sala
            </button>
          </div>
        )}

        {modo === 'criar' && (
          <form onSubmit={handleCriar} className={styles.form}>
            <label className={styles.label}>Seu nome</label>
            <input
              className={styles.input}
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Digite seu nome"
              maxLength={20}
              autoFocus
            />
            <button className={styles.btn} type="submit" disabled={!nome.trim()}>
              Criar Sala
            </button>
            <button className={styles.link} type="button" onClick={() => setModo(null)}>
              ← Voltar
            </button>
          </form>
        )}

        {modo === 'entrar' && (
          <form onSubmit={handleEntrar} className={styles.form}>
            <label className={styles.label}>Seu nome</label>
            <input
              className={styles.input}
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Digite seu nome"
              maxLength={20}
              autoFocus
            />
            <label className={styles.label}>Código da sala</label>
            <input
              className={styles.input}
              value={roomIdInput}
              onChange={e => setRoomIdInput(e.target.value.toUpperCase())}
              placeholder="Ex: A1B2C3"
              maxLength={6}
            />
            <button
              className={styles.btn}
              type="submit"
              disabled={!nome.trim() || roomIdInput.length < 6}
            >
              Entrar
            </button>
            <button className={styles.link} type="button" onClick={() => setModo(null)}>
              ← Voltar
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
