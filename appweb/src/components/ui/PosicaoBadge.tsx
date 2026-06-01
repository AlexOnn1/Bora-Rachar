import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Posicao, POSICOES, POSICAO_COLORS, DS } from '@/constants/design';

export type { Posicao };
export { POSICOES };

interface PosicaoBadgeProps {
  posicao: Posicao;
  small?: boolean;
}

export function PosicaoBadge({ posicao, small = false }: PosicaoBadgeProps) {
  const bg = POSICAO_COLORS[posicao];
  return (
    <View style={[styles.badge, { backgroundColor: bg + '33', borderColor: bg }, small && styles.badgeSm]}>
      <Text style={[styles.badgeText, { color: bg }, small && styles.badgeTextSm]}>
        {posicao}
      </Text>
    </View>
  );
}

interface PosicaoSelectorProps {
  value: Posicao | null;
  onChange: (p: Posicao) => void;
}

export function PosicaoSelector({ value, onChange }: PosicaoSelectorProps) {
  return (
    <View style={styles.grid}>
      {POSICOES.map((pos) => {
        const selected = value === pos;
        const color = POSICAO_COLORS[pos];
        return (
          <Pressable
            key={pos}
            onPress={() => onChange(pos)}
            style={({ pressed }) => [
              styles.chip,
              {
                backgroundColor: selected ? color : color + '15',
                borderColor: selected ? color : color + '55',
              },
              pressed && { transform: [{ scale: 0.96 }] },
            ]}
          >
            <Text style={[styles.chipText, { color: selected ? '#FFFFFF' : color }]}>
              {pos}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: DS.radius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: DS.font.sm,
    fontWeight: '700',
  },
  badgeTextSm: {
    fontSize: DS.font.xs,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: DS.radius.full,
    borderWidth: 1.5,
  },
  chipText: {
    fontSize: DS.font.sm,
    fontWeight: '700',
  },
});
