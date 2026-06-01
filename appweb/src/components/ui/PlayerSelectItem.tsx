import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PosicaoBadge, Posicao } from './PosicaoBadge';
import { StarRating } from './StarRating';

interface PlayerSelectItemProps {
  id: string;
  nome: string;
  nota: number;
  posicao: Posicao;
  selecionado: boolean;
  onToggle: (id: string) => void;
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

export function PlayerSelectItem({
  id,
  nome,
  nota,
  posicao,
  selecionado,
  onToggle,
}: PlayerSelectItemProps) {
  const color = getColor(nome);
  const initial = nome.trim().charAt(0).toUpperCase();

  return (
    <Pressable
      onPress={() => onToggle(id)}
      style={({ pressed }) => [
        styles.card,
        selecionado && styles.cardSelected,
        pressed && styles.cardPressed,
      ]}
    >
      {/* Checkbox */}
      <View style={[styles.checkbox, selecionado && styles.checkboxSelected]}>
        {selecionado && <Text style={styles.checkmark}>✓</Text>}
      </View>

      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: selecionado ? color : '#2A3A2A' }]}>
        <Text style={[styles.avatarText, !selecionado && styles.avatarTextDim]}>
          {initial}
        </Text>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={[styles.nome, !selecionado && styles.nomeDim]} numberOfLines={1}>
          {nome}
        </Text>
        <PosicaoBadge posicao={posicao} small />
      </View>

      {/* Nota */}
      <StarRating value={nota} size={14} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111E11',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: '#1E2E1E',
  },
  cardSelected: {
    backgroundColor: '#1A2E1A',
    borderColor: '#2E7D32',
  },
  cardPressed: {
    opacity: 0.8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#3A5A3A',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkboxSelected: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 16,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  avatarTextDim: {
    color: '#5A7A5A',
  },
  info: {
    flex: 1,
    gap: 3,
  },
  nome: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  nomeDim: {
    color: '#5A7A5A',
  },
});
