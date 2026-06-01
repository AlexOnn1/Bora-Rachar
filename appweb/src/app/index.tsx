import { useEffect, useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSplash } from '@/components/SplashTransition';
import { DS } from '@/constants/design';

export default function HomeScreen() {
  const router = useRouter();
  const { navigate } = useSplash();

  const fadeY  = useRef(new Animated.Value(24)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(fadeY, { toValue: 0, tension: 100, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  function go(path: '/jogadores' | '/jogadores/novo' | '/sorteio') {
    navigate(() => router.push(path));
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.bgTop} />
      <View style={styles.bgBottom} />

      <Animated.View style={[styles.container, { opacity, transform: [{ translateY: fadeY }] }]}>

        {/* ── Hero ── */}
        <View style={styles.hero}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* ── Card de ações ── */}
        <View style={styles.card}>

          <Pressable
            onPress={() => go('/sorteio')}
            style={({ pressed }) => [styles.mainAction, pressed && styles.pressed]}
          >
            <View style={styles.mainActionIcon}>
              <Text style={styles.mainActionEmoji}>⚡</Text>
            </View>
            <View style={styles.mainActionText}>
              <Text style={styles.mainActionTitle}>Sortear Times</Text>
              <Text style={styles.mainActionSub}>Monte times equilibrados agora</Text>
            </View>
            <Text style={styles.mainActionArrow}>›</Text>
          </Pressable>

          <View style={styles.divider} />

          <View style={styles.secondaryRow}>
            <Pressable
              onPress={() => go('/jogadores')}
              style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]}
            >
              <Text style={styles.secondaryEmoji}>👥</Text>
              <Text style={styles.secondaryLabel}>Ver Jogadores</Text>
            </Pressable>

            <View style={styles.verticalDivider} />

            <Pressable
              onPress={() => go('/jogadores/novo')}
              style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]}
            >
              <Text style={styles.secondaryEmoji}>➕</Text>
              <Text style={styles.secondaryLabel}>Cadastrar</Text>
            </Pressable>
          </View>

        </View>

        <Text style={styles.footer}>Futebol de alto nível kkkkk</Text>

      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: DS.color.bg },

  bgTop: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: '55%',
    backgroundColor: '#081508',
  },
  bgBottom: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: '45%',
    backgroundColor: DS.color.bg,
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    gap: 0,
  },

  hero: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 28,
  },
  logo: {
    width: 360,
    height: 300,
  },

  card: {
    backgroundColor: DS.color.surface,
    borderRadius: DS.radius.lg,
    borderWidth: 1.5,
    borderColor: DS.color.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },

  mainAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 20,
    backgroundColor: DS.color.green900,
  },
  pressed: { opacity: 0.8 },
  mainActionIcon: {
    width: 52, height: 52,
    borderRadius: 14,
    backgroundColor: DS.color.green700,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  mainActionEmoji: { fontSize: 26 },
  mainActionText: { flex: 1, gap: 3 },
  mainActionTitle: {
    color: DS.color.textPrimary,
    fontSize: DS.font.lg,
    fontWeight: '800',
  },
  mainActionSub: {
    color: DS.color.green300,
    fontSize: DS.font.sm,
  },
  mainActionArrow: {
    color: DS.color.green500,
    fontSize: 28,
    fontWeight: '300',
  },

  divider: { height: 1, backgroundColor: DS.color.border },

  secondaryRow: { flexDirection: 'row' },
  secondaryBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 20,
  },
  secondaryEmoji: { fontSize: 28 },
  secondaryLabel: {
    color: DS.color.textSecondary,
    fontSize: DS.font.sm,
    fontWeight: '700',
  },
  verticalDivider: { width: 1, backgroundColor: DS.color.border },

  footer: {
    textAlign: 'center',
    color: DS.color.textMuted,
    fontSize: DS.font.xs,
    marginTop: 24,
    letterSpacing: 2,
    fontWeight: '700',
  },
});