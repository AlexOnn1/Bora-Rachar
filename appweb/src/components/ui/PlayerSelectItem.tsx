import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PosicaoBadge, Posicao } from './PosicaoBadge';
import { StarRating } from './StarRating';
import { DS, getAvatarColor } from '@/constants/design';

interface PlayerSelectItemProps {
  id: string;
  nome: string;
  nota: number;
  posicao: Posicao;
  selecionado: boolean;
  onToggle: (id: string) => void;
}

export function PlayerSelectItem({ id, nome, nota, posicao, selecionado, onToggle }: PlayerSelectItemProps) {
  const avatarColor = getAvatarColor(nome);
  const initial = nome.trim().charAt(0).toUpperCase();

  return (
    <Pressable
      onPress={() => onToggle(id)}
      style={({ pressed }) => [
        styles.card,
        selecionado && styles.cardOn,
        pressed && { opacity: 0.85 },
      ]}
    >
      {/* Checkbox */}
      <View style={[styles.check, selecionado && styles.checkOn]}>
        {selecionado && <Text style={styles.checkMark}>✓</Text>}
      </View>

      {/* Avatar */}
      <View style={[
        styles.avatar,
        { backgroundColor: selecionado ? avatarColor + '30' : '#1A2A1A', borderColor: selecionado ? avatarColor + '70' : DS.color.border }
      ]}>
        <Text style={[styles.avatarText, { color: selecionado ? avatarColor : DS.color.textMuted }]}>
          {initial}
        </Text>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={[styles.nome, !selecionado && styles.nomeDim]} numberOfLines={1}>{nome}</Text>
        <PosicaoBadge posicao={posicao} small />
      </View>

      {/* Estrelas */}
      <StarRating value={nota} size={13} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: DS.color.surface,
    borderRadius: DS.radius.md,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: DS.color.border,
    minHeight: 66,
  },
  cardOn: {
    backgroundColor: '#0F2010',
    borderColor: DS.color.green700,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: DS.color.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkOn: {
    backgroundColor: DS.color.green700,
    borderColor: DS.color.green700,
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 18,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '900',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  nome: {
    color: DS.color.textPrimary,
    fontSize: DS.font.md,
    fontWeight: '700',
  },
  nomeDim: {
    color: DS.color.textMuted,
  },
});
