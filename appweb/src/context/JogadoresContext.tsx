import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Jogador } from '@/components/ui/PlayerCard';

const STORAGE_KEY = '@borarachar:jogadores';

interface JogadoresContextData {
  jogadores: Jogador[];
  carregando: boolean;
  adicionarJogador: (j: Omit<Jogador, 'id'>) => Promise<void>;
  editarJogador: (j: Jogador) => Promise<void>;
  excluirJogador: (id: string) => Promise<void>;
  buscarJogador: (id: string) => Jogador | undefined;
}

const JogadoresContext = createContext<JogadoresContextData | null>(null);

export function JogadoresProvider({ children }: { children: ReactNode }) {
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Carrega do storage ao iniciar
  useEffect(() => {
    async function carregar() {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) setJogadores(JSON.parse(json));
      } catch (e) {
        console.error('Erro ao carregar jogadores:', e);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  // Salva no storage sempre que a lista mudar
  async function persistir(lista: Jogador[]) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    } catch (e) {
      console.error('Erro ao salvar jogadores:', e);
    }
  }

  async function adicionarJogador(dados: Omit<Jogador, 'id'>) {
    const novo: Jogador = { ...dados, id: Date.now().toString() };
    const nova = [...jogadores, novo];
    setJogadores(nova);
    await persistir(nova);
  }

  async function editarJogador(atualizado: Jogador) {
    const nova = jogadores.map((j) => (j.id === atualizado.id ? atualizado : j));
    setJogadores(nova);
    await persistir(nova);
  }

  async function excluirJogador(id: string) {
    const nova = jogadores.filter((j) => j.id !== id);
    setJogadores(nova);
    await persistir(nova);
  }

  function buscarJogador(id: string) {
    return jogadores.find((j) => j.id === id);
  }

  return (
    <JogadoresContext.Provider
      value={{ jogadores, carregando, adicionarJogador, editarJogador, excluirJogador, buscarJogador }}
    >
      {children}
    </JogadoresContext.Provider>
  );
}

export function useJogadores() {
  const ctx = useContext(JogadoresContext);
  if (!ctx) throw new Error('useJogadores deve ser usado dentro de JogadoresProvider');
  return ctx;
}