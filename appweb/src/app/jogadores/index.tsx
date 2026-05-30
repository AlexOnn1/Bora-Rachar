import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useJogadores } from '@/context/JogadoresContext';
import { PlayerCard } from '@/components/ui/PlayerCard';
import { CustomButton } from '@/components/ui/CustomButton';

export default function JogadoresScreen() {
  const router = useRouter();
  const { jogadores } = useJogadores();

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Voltar</Text>
        </Pressable>
        <Text style={styles.title}>Jogadores</Text>
        <Text style={styles.count}>{jogadores.length}</Text>
      </View>

      {/* Lista */}
      {jogadores.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>👥</Text>
          <Text style={styles.emptyText}>Nenhum jogador cadastrado ainda.</Text>
        </View>
      ) : (
        <FlatList
          data={jogadores}
          keyExtractor={(j) => j.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <PlayerCard
              jogador={item}
              onPress={() => router.push(`/jogadores/${item.id}`)}
            />
          )}
        />
      )}

      {/* Botão fixo */}
      <View style={styles.footer}>
        <CustomButton
          label="+ Adicionar Jogador"
          onPress={() => router.push('/jogadores/novo')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0A1A0A' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 12,
  },
  backBtn: { paddingVertical: 8, paddingRight: 8 },
  backText: { color: '#4CAF50', fontSize: 15, fontWeight: '600' },
  title: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', flex: 1 },
  count: {
    backgroundColor: '#1B5E20',
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  list: { paddingHorizontal: 20, gap: 10, paddingBottom: 20 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyIcon: { fontSize: 48 },
  emptyText: { color: '#5A7A5A', fontSize: 16 },
  footer: { padding: 20, paddingTop: 8 },
});
