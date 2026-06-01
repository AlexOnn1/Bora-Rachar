import { Pressable, StyleSheet, Text, View } from 'react-native';

interface StarRatingProps {
  value: number;
  size?: number;
}

export function StarRating({ value, size = 18 }: StarRatingProps) {
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

interface StarRatingInputProps {
  value: number;
  onChange: (val: number) => void;
  size?: number;
}

export function StarRatingInput({ value, onChange, size = 40 }: StarRatingInputProps) {
  return (
    <View style={styles.inputRow}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Pressable
          key={i}
          onPress={() => onChange(i)}
          hitSlop={10}
          style={({ pressed }) => [styles.starBtn, pressed && { transform: [{ scale: 1.2 }] }]}
        >
          <Text style={{ fontSize: size }}>
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
    gap: 1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  starBtn: {
    padding: 4,
  },
});
