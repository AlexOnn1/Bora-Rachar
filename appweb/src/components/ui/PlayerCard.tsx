import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StarRating } from './StarRating';
import { PosicaoBadge, Posicao } from './PosicaoBadge';

export interface Jogador {
  id: string;
  nome: string;
  nota: number; // 1–5
  posicao: Posicao;
}

interface PlayerCardProps {
  jogador: Jogador;
  onPress?: () => void;
}

function getInitial(nome: string) {
  return nome.trim().charAt(0).toUpperCase();
}

const INITIAL_COLORS = [
  '#1B5E20', '#2E7D32', '#388E3C', '#1565C0', '#6A1B9A',
  '#B71C1C', '#E65100', '#00695C', '#F57F17', '#37474F',
];

function getColor(nome: string) {
  let hash = 0;
  for (let i = 0; i < nome.length; i++) hash += nome.charCodeAt(i);
  return INITIAL_COLORS[hash % INITIAL_COLORS.length];
}

export function PlayerCard({ jogador, onPress }: PlayerCardProps) {
  const color = getColor(jogador.nome);
  const initial = getInitial(jogador.nome);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: color }]}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.nome} numberOfLines={1}>{jogador.nome}</Text>
        <PosicaoBadge posicao={jogador.posicao} small />
      </View>

      {/* Nota */}
      <StarRating value={jogador.nota} size={16} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A2E1A',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#2A4A2A',
  },
  cardPressed: {
    backgroundColor: '#243824',
    transform: [{ scale: 0.99 }],
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  nome: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
