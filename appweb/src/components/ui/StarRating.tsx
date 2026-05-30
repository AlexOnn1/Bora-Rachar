import { Pressable, StyleSheet, Text, View } from 'react-native';

// ─── StarRating (somente visualização) ───────────────────────────────────────
interface StarRatingProps {
  value: number; // 1–5
  size?: number;
}

export function StarRating({ value, size = 20 }: StarRatingProps) {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text key={i} style={{ fontSize: size, lineHeight: size + 4 }}>
          {i <= value ? '⭐' : '☆'}
        </Text>
      ))}
    </View>
  );
}

// ─── StarRatingInput (interativo para cadastro) ───────────────────────────────
interface StarRatingInputProps {
  value: number;
  onChange: (val: number) => void;
  size?: number;
}

export function StarRatingInput({ value, onChange, size = 32 }: StarRatingInputProps) {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Pressable key={i} onPress={() => onChange(i)} hitSlop={8}>
          <Text style={{ fontSize: size, lineHeight: size + 8 }}>
            {i <= value ? '⭐' : '☆'}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
});
