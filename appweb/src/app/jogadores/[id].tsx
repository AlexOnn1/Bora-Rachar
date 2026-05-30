import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useJogadores } from '@/context/JogadoresContext';
import { CustomButton } from '@/components/ui/CustomButton';
import { StarRatingInput } from '@/components/ui/StarRating';
import { PosicaoSelector, Posicao } from '@/components/ui/PosicaoBadge';

export default function JogadorDetalheScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { buscarJogador, editarJogador, excluirJogador } = useJogadores();

  const jogador = buscarJogador(id);

  const [nome, setNome] = useState(jogador?.nome ?? '');
  const [nota, setNota] = useState(jogador?.nota ?? 3);
  const [posicao, setPosicao] = useState<Posicao | null>(jogador?.posicao ?? null);

  if (!jogador) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Jogador não encontrado.</Text>
          <CustomButton label="Voltar" onPress={() => router.back()} fullWidth={false} />
        </View>
      </SafeAreaView>
    );
  }

  function salvar() {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'Informe o nome do jogador.');
      return;
    }
    if (!posicao) {
      Alert.alert('Atenção', 'Selecione a posição do jogador.');
      return;
    }
    editarJogador({ id, nome: nome.trim(), nota, posicao });
    router.back();
  }

  function confirmarExclusao() {
    Alert.alert(
      'Excluir jogador',
      `Tem certeza que deseja excluir ${jogador.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            excluirJogador(id);
            router.back();
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Voltar</Text>
          </Pressable>
          <Text style={styles.title} numberOfLines={1}>{jogador.nome}</Text>
          <Pressable onPress={confirmarExclusao} style={styles.deleteBtn}>
            <Text style={styles.deleteText}>🗑</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
          {/* Nome */}
          <View style={styles.field}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
              placeholderTextColor="#3A5A3A"
            />
          </View>

          {/* Nota */}
          <View style={styles.field}>
            <Text style={styles.label}>Nota</Text>
            <StarRatingInput value={nota} onChange={setNota} size={36} />
          </View>

          {/* Posição */}
          <View style={styles.field}>
            <Text style={styles.label}>Posição</Text>
            <PosicaoSelector value={posicao} onChange={setPosicao} />
          </View>
        </ScrollView>

        {/* Botões */}
        <View style={styles.footer}>
          <CustomButton label="Cancelar" onPress={() => router.back()} variant="secondary" />
          <CustomButton label="Salvar" onPress={salvar} variant="primary" />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0A1A0A' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  errorText: { color: '#B0C4B0', fontSize: 16 },
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
  title: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', flex: 1 },
  deleteBtn: { padding: 8 },
  deleteText: { fontSize: 20 },
  form: { paddingHorizontal: 20, gap: 28, paddingBottom: 20 },
  field: { gap: 12 },
  label: {
    color: '#B0C4B0',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#1A2E1A',
    borderWidth: 1.5,
    borderColor: '#2A4A2A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#FFFFFF',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    paddingTop: 8,
  },
});
