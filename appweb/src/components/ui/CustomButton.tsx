import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { DS } from '@/constants/design';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface CustomButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  style?: ViewStyle;
}

const CONFIG: Record<Variant, {
  bg: string; text: string; border: string; shadow: string;
}> = {
  primary:   { bg: DS.color.green700,  text: '#FFFFFF',        border: DS.color.green500,  shadow: '#0D3B0D' },
  secondary: { bg: 'transparent',      text: DS.color.green300, border: DS.color.green700,  shadow: 'transparent' },
  danger:    { bg: '#7F1212',          text: '#FFFFFF',        border: '#B71C1C',           shadow: '#3B0D0D' },
  ghost:     { bg: 'rgba(46,125,50,0.12)', text: DS.color.green300, border: 'rgba(46,125,50,0.3)', shadow: 'transparent' },
};

export function CustomButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  icon,
  style,
}: CustomButtonProps) {
  const c = CONFIG[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.outer,
        { shadowColor: c.shadow, opacity: disabled ? 0.4 : 1 },
        pressed && styles.pressed,
        style,
      ]}
    >
      {/* Sombra inferior (efeito 3D) */}
      <View style={[styles.shadow, { backgroundColor: c.shadow }]} />

      {/* Corpo do botão */}
      <View
        style={[
          styles.body,
          {
            backgroundColor: c.bg,
            borderColor: c.border,
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={c.text} size="small" />
        ) : (
          <View style={styles.row}>
            {icon && <Text style={[styles.icon, { color: c.text }]}>{icon}</Text>}
            <Text style={[styles.label, { color: c.text }]}>{label}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    marginBottom: 4,
  },
  pressed: {
    transform: [{ translateY: 3 }],
  },
  shadow: {
    position: 'absolute',
    bottom: -4,
    left: 2,
    right: 2,
    height: '100%',
    borderRadius: DS.radius.md,
    zIndex: 0,
  },
  body: {
    borderRadius: DS.radius.md,
    borderWidth: 1.5,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    zIndex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 18,
  },
  label: {
    fontSize: DS.font.md,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
