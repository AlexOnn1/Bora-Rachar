import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

// 🚧 Tela de sorteio — será implementada na Parte 2
export default function SorteioScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>← Voltar</Text>
        </Pressable>
      </View>
      <View style={styles.center}>
        <Text style={styles.icon}>⚡</Text>
        <Text style={styles.title}>Sorteio de Times</Text>
        <Text style={styles.sub}>Em breve — Parte 2 do desenvolvimento</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0A1A0A' },
  header: { paddingHorizontal: 20, paddingTop: 8 },
  back: { color: '#4CAF50', fontSize: 15, fontWeight: '600', paddingVertical: 8 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  icon: { fontSize: 56 },
  title: { color: '#FFFFFF', fontSize: 26, fontWeight: '800' },
  sub: { color: '#5A7A5A', fontSize: 14 },
});
