import { useRef, useEffect } from 'react';
import { Animated, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useJogadores } from '@/context/JogadoresContext';
import { PlayerCard } from '@/components/ui/PlayerCard';
import { CustomButton } from '@/components/ui/CustomButton';
import { useSplash } from '@/components/SplashTransition';
import { DS } from '@/constants/design';

export default function JogadoresScreen() {
  const router = useRouter();
  const { navigate } = useSplash();
  const { jogadores } = useJogadores();

  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <Animated.View style={[{ flex: 1 }, { opacity }]}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => navigate(() => router.back())} style={styles.backBtn}>
            <Text style={styles.backArrow}>‹</Text>
            <Text style={styles.backText}>Voltar</Text>
          </Pressable>
          <Text style={styles.title}>Jogadores</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{jogadores.length}</Text>
          </View>
        </View>

        {/* Lista ou estado vazio */}
        {jogadores.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyTitle}>Nenhum jogador ainda</Text>
            <Text style={styles.emptySubtitle}>Cadastre o primeiro jogador para começar o racha</Text>
          </View>
        ) : (
          <FlatList
            data={jogadores}
            keyExtractor={(j) => j.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <PlayerCard
                jogador={item}
                onPress={() => navigate(() => router.push(`/jogadores/${item.id}`))}
              />
            )}
          />
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <CustomButton
            label="Cadastrar Jogador"
            icon="+"
            onPress={() => navigate(() => router.push('/jogadores/novo'))}
          />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: DS.color.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: DS.color.border,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 6,
    paddingRight: 8,
  },
  backArrow: { color: DS.color.green500, fontSize: 26, lineHeight: 28, marginTop: -2 },
  backText:  { color: DS.color.green500, fontSize: DS.font.md, fontWeight: '600' },
  title: { color: DS.color.textPrimary, fontSize: DS.font.xl, fontWeight: '900', flex: 1 },
  countBadge: {
    backgroundColor: DS.color.green900,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: DS.radius.full,
    borderWidth: 1,
    borderColor: DS.color.green700,
  },
  countText: { color: DS.color.green300, fontSize: DS.font.sm, fontWeight: '800' },

  list: { padding: 16, gap: 10 },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 40 },
  emptyIcon:     { fontSize: 52 },
  emptyTitle:    { color: DS.color.textPrimary, fontSize: DS.font.lg, fontWeight: '700' },
  emptySubtitle: { color: DS.color.textSecondary, fontSize: DS.font.sm, textAlign: 'center' },

  footer: { padding: 16, paddingTop: 8, borderTopWidth: 1, borderTopColor: DS.color.border },
});
