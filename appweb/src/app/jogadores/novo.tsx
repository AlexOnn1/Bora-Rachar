import { useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Platform,
  Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useJogadores } from '@/context/JogadoresContext';
import { CustomButton } from '@/components/ui/CustomButton';
import { StarRatingInput } from '@/components/ui/StarRating';
import { PosicaoSelector, Posicao } from '@/components/ui/PosicaoBadge';
import { useSplash } from '@/components/SplashTransition';
import { DS } from '@/constants/design';

export default function NovoJogadorScreen() {
  const router = useRouter();
  const { navigate } = useSplash();
  const { adicionarJogador } = useJogadores();

  const [nome, setNome] = useState('');
  const [nota, setNota] = useState(3);
  const [posicao, setPosicao] = useState<Posicao | null>(null);

  function salvar() {
    if (!nome.trim()) { Alert.alert('Atenção', 'Informe o nome do jogador.'); return; }
    if (!posicao)      { Alert.alert('Atenção', 'Selecione a posição.');       return; }
    adicionarJogador({ nome: nome.trim(), nota, posicao });
    navigate(() => router.back());
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>

        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => navigate(() => router.back())} style={styles.backBtn}>
            <Text style={styles.backArrow}>‹</Text>
            <Text style={styles.backText}>Voltar</Text>
          </Pressable>
          <Text style={styles.title}>Novo Jogador</Text>
        </View>

        <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Nome */}
          <View style={styles.field}>
            <Text style={styles.label}>NOME</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Carlos, João Silva..."
              placeholderTextColor={DS.color.textMuted}
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
              returnKeyType="done"
            />
          </View>

          {/* Nota */}
          <View style={styles.field}>
            <Text style={styles.label}>NÍVEL</Text>
            <View style={styles.notaCard}>
              <StarRatingInput value={nota} onChange={setNota} size={42} />
              <Text style={styles.notaDesc}>
                {['', 'Iniciante', 'Básico', 'Médio', 'Bom', 'Craque'][nota]}
              </Text>
            </View>
          </View>

          {/* Posição */}
          <View style={styles.field}>
            <Text style={styles.label}>POSIÇÃO</Text>
            <PosicaoSelector value={posicao} onChange={setPosicao} />
          </View>

        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={{ flex: 1 }}>
            <CustomButton label="Cancelar" onPress={() => navigate(() => router.back())} variant="secondary" />
          </View>
          <View style={{ flex: 1 }}>
            <CustomButton label="Salvar" onPress={salvar} variant="primary" />
          </View>
        </View>
      </KeyboardAvoidingView>
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
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingVertical: 6, paddingRight: 8 },
  backArrow: { color: DS.color.green500, fontSize: 26, lineHeight: 28, marginTop: -2 },
  backText:  { color: DS.color.green500, fontSize: DS.font.md, fontWeight: '600' },
  title: { color: DS.color.textPrimary, fontSize: DS.font.xl, fontWeight: '900' },

  form: { padding: 20, gap: 28 },
  field: { gap: 12 },
  label: {
    color: DS.color.textSecondary,
    fontSize: DS.font.xs,
    fontWeight: '800',
    letterSpacing: 2,
  },
  input: {
    backgroundColor: DS.color.surface,
    borderWidth: 1.5,
    borderColor: DS.color.border,
    borderRadius: DS.radius.md,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: DS.color.textPrimary,
    fontSize: DS.font.md,
  },
  notaCard: {
    backgroundColor: DS.color.surface,
    borderWidth: 1.5,
    borderColor: DS.color.border,
    borderRadius: DS.radius.md,
    padding: 20,
    alignItems: 'center',
    gap: 10,
  },
  notaDesc: {
    color: DS.color.green300,
    fontSize: DS.font.sm,
    fontWeight: '700',
    letterSpacing: 1,
  },

  footer: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: DS.color.border,
  },
});
