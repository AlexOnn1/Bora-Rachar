import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StarRating } from './StarRating';
import { PosicaoBadge } from './PosicaoBadge';
import { DS, getAvatarColor, Posicao } from '@/constants/design';

export interface Jogador {
  id: string;
  nome: string;
  nota: number;
  posicao: Posicao;
}

interface PlayerCardProps {
  jogador: Jogador;
  onPress?: () => void;
}

export function PlayerCard({ jogador, onPress }: PlayerCardProps) {
  const avatarColor = getAvatarColor(jogador.nome);
  const initial = jogador.nome.trim().charAt(0).toUpperCase();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      {/* Barra lateral colorida */}
      <View style={[styles.accent, { backgroundColor: avatarColor }]} />

      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: avatarColor + '30', borderColor: avatarColor + '60' }]}>
        <Text style={[styles.avatarText, { color: avatarColor }]}>{initial}</Text>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.nome} numberOfLines={1}>{jogador.nome}</Text>
        <PosicaoBadge posicao={jogador.posicao} small />
      </View>

      {/* Nota */}
      <View style={styles.notaBox}>
        <StarRating value={jogador.nota} size={14} />
        <Text style={styles.notaNum}>{jogador.nota}/5</Text>
      </View>

      {/* Seta */}
      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: DS.color.surface,
    borderRadius: DS.radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: DS.color.border,
    overflow: 'hidden',
    minHeight: 72,
  },
  cardPressed: {
    backgroundColor: DS.color.surfaceAlt,
    transform: [{ scale: 0.99 }],
  },
  accent: {
    width: 4,
    alignSelf: 'stretch',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '900',
  },
  info: {
    flex: 1,
    gap: 5,
    paddingVertical: 12,
  },
  nome: {
    color: DS.color.textPrimary,
    fontSize: DS.font.md,
    fontWeight: '700',
  },
  notaBox: {
    alignItems: 'flex-end',
    gap: 2,
  },
  notaNum: {
    color: DS.color.textMuted,
    fontSize: DS.font.xs,
  },
  arrow: {
    color: DS.color.textMuted,
    fontSize: 22,
    paddingRight: 12,
    fontWeight: '300',
  },
});
