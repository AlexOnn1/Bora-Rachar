/**
 * JogadoresContext
 * Estado global dos jogadores. Por enquanto usa estado em memória com
 * dados de exemplo. O time de backend pode trocar as funções CRUD aqui
 * por chamadas ao banco sem alterar nenhuma tela.
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Jogador } from '@/components/ui/PlayerCard';

// ─── Dados de exemplo para visualizar as telas ────────────────────────────────
const JOGADORES_INICIAIS: Jogador[] = [];

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface JogadoresContextData {
  jogadores: Jogador[];
  adicionarJogador: (j: Omit<Jogador, 'id'>) => void;
  editarJogador: (j: Jogador) => void;
  excluirJogador: (id: string) => void;
  buscarJogador: (id: string) => Jogador | undefined;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const JogadoresContext = createContext<JogadoresContextData | null>(null);

export function JogadoresProvider({ children }: { children: ReactNode }) {
  const [jogadores, setJogadores] = useState<Jogador[]>(JOGADORES_INICIAIS);

  function adicionarJogador(dados: Omit<Jogador, 'id'>) {
    const novo: Jogador = { ...dados, id: Date.now().toString() };
    setJogadores((prev) => [...prev, novo]);
  }

  function editarJogador(atualizado: Jogador) {
    setJogadores((prev) =>
      prev.map((j) => (j.id === atualizado.id ? atualizado : j))
    );
  }

  function excluirJogador(id: string) {
    setJogadores((prev) => prev.filter((j) => j.id !== id));
  }

  function buscarJogador(id: string) {
    return jogadores.find((j) => j.id === id);
  }

  return (
    <JogadoresContext.Provider
      value={{ jogadores, adicionarJogador, editarJogador, excluirJogador, buscarJogador }}
    >
      {children}
    </JogadoresContext.Provider>
  );
}

export function useJogadores() {
  const ctx = useContext(JogadoresContext);
  if (!ctx) throw new Error('useJogadores must be used within JogadoresProvider');
  return ctx;
}
