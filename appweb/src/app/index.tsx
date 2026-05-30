import { Image, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomButton } from '@/components/ui/CustomButton';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.ball}>⚽</Text>
          <Text style={styles.title}>BORA{'\n'}RACHAR</Text>
          <Text style={styles.subtitle}>organize seu futebol</Text>
        </View>

        {/* Ações */}
        <View style={styles.actions}>
          <CustomButton
            label="+ Criar Jogador"
            onPress={() => router.push('/jogadores/novo')}
            variant="primary"
          />
          <CustomButton
            label="Ver Jogadores"
            onPress={() => router.push('/jogadores')}
            variant="secondary"
          />
          <CustomButton
            label="⚡ Sortear Times"
            onPress={() => router.push('/sorteio')}
            variant="ghost"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0A1A0A',
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'space-between',
    paddingBottom: 40,
    paddingTop: 20,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  ball: {
    fontSize: 80,
  },
  title: {
    fontSize: 56,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 56,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: '#4CAF50',
    letterSpacing: 3,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  actions: {
    gap: 12,
  },
});
