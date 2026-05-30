import { Pressable, StyleSheet, Text, View } from 'react-native';

export type Posicao =
  | 'Goleiro'
  | 'Zagueiro'
  | 'Lateral Direito'
  | 'Lateral Esquerdo'
  | 'Volante'
  | 'Meia'
  | 'Meia Atacante'
  | 'Ponta Direita'
  | 'Ponta Esquerda'
  | 'Centroavante'
  | 'Segundo Atacante';

export const POSICOES: Posicao[] = [
  'Goleiro',
  'Zagueiro',
  'Lateral Direito',
  'Lateral Esquerdo',
  'Volante',
  'Meia',
  'Meia Atacante',
  'Ponta Direita',
  'Ponta Esquerda',
  'Centroavante',
  'Segundo Atacante',
];

const POSICAO_COLORS: Record<Posicao, { bg: string; text: string }> = {
  Goleiro: { bg: '#F57F17', text: '#FFFFFF' },
  Zagueiro: { bg: '#1565C0', text: '#FFFFFF' },
  'Lateral Direito': { bg: '#0277BD', text: '#FFFFFF' },
  'Lateral Esquerdo': { bg: '#0277BD', text: '#FFFFFF' },
  Volante: { bg: '#6A1B9A', text: '#FFFFFF' },
  Meia: { bg: '#00695C', text: '#FFFFFF' },
  'Meia Atacante': { bg: '#2E7D32', text: '#FFFFFF' },
  'Ponta Direita': { bg: '#558B2F', text: '#FFFFFF' },
  'Ponta Esquerda': { bg: '#558B2F', text: '#FFFFFF' },
  Centroavante: { bg: '#B71C1C', text: '#FFFFFF' },
  'Segundo Atacante': { bg: '#C62828', text: '#FFFFFF' },
};

// ─── Badge de exibição ────────────────────────────────────────────────────────
interface PosicaoBadgeProps {
  posicao: Posicao;
  small?: boolean;
}

export function PosicaoBadge({ posicao, small = false }: PosicaoBadgeProps) {
  const colors = POSICAO_COLORS[posicao];
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: colors.bg },
        small && styles.badgeSmall,
      ]}
    >
      <Text style={[styles.badgeText, small && styles.badgeTextSmall, { color: colors.text }]}>
        {posicao}
      </Text>
    </View>
  );
}

// ─── Seletor de posição (interativo) ─────────────────────────────────────────
interface PosicaoSelectorProps {
  value: Posicao | null;
  onChange: (pos: Posicao) => void;
}

export function PosicaoSelector({ value, onChange }: PosicaoSelectorProps) {
  return (
    <View style={styles.selectorContainer}>
      {POSICOES.map((pos) => {
        const selected = value === pos;
        const colors = POSICAO_COLORS[pos];
        return (
          <Pressable
            key={pos}
            onPress={() => onChange(pos)}
            style={[
              styles.selectorBadge,
              {
                backgroundColor: selected ? colors.bg : 'transparent',
                borderColor: colors.bg,
              },
            ]}
          >
            <Text
              style={[
                styles.selectorText,
                { color: selected ? '#FFFFFF' : colors.bg },
              ]}
            >
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  badgeSmall: {
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  badgeTextSmall: {
    fontSize: 11,
  },
  selectorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectorBadge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 2,
  },
  selectorText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
