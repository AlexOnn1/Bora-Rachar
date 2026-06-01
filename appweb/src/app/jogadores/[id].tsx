import { useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Platform,
  Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useJogadores } from '@/context/JogadoresContext';
import { CustomButton } from '@/components/ui/CustomButton';
import { StarRatingInput } from '@/components/ui/StarRating';
import { PosicaoSelector, Posicao } from '@/components/ui/PosicaoBadge';
import { useSplash } from '@/components/SplashTransition';
import { DS, getAvatarColor } from '@/constants/design';

export default function JogadorDetalheScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { navigate } = useSplash();
  const { buscarJogador, editarJogador, excluirJogador } = useJogadores();

  const jogador = buscarJogador(id);
  const [nome, setNome]     = useState(jogador?.nome ?? '');
  const [nota, setNota]     = useState(jogador?.nota ?? 3);
  const [posicao, setPosicao] = useState<Posicao | null>(jogador?.posicao ?? null);

  if (!jogador) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Jogador não encontrado.</Text>
          <CustomButton label="Voltar" onPress={() => navigate(() => router.back())} />
        </View>
      </SafeAreaView>
    );
  }

  const avatarColor = getAvatarColor(jogador.nome);
  const initial = jogador.nome.trim().charAt(0).toUpperCase();

  function salvar() {
    if (!nome.trim()) { Alert.alert('Atenção', 'Informe o nome.'); return; }
    if (!posicao)      { Alert.alert('Atenção', 'Selecione a posição.'); return; }
    editarJogador({ id, nome: nome.trim(), nota, posicao });
    navigate(() => router.back());
  }

  function confirmarExclusao() {
    Alert.alert('Excluir jogador', `Remover ${jogador.nome} da lista?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => { excluirJogador(id); navigate(() => router.back()); },
      },
    ]);
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
          <Text style={styles.title} numberOfLines={1}>Editar</Text>
          <Pressable onPress={confirmarExclusao} style={styles.deleteBtn}>
            <Text style={styles.deleteIcon}>🗑</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Avatar preview */}
          <View style={[styles.avatarPreview, { borderColor: avatarColor + '50' }]}>
            <View style={[styles.avatarCircle, { backgroundColor: avatarColor + '25', borderColor: avatarColor + '60' }]}>
              <Text style={[styles.avatarLetter, { color: avatarColor }]}>{initial}</Text>
            </View>
          </View>

          {/* Nome */}
          <View style={styles.field}>
            <Text style={styles.label}>NOME</Text>
            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
              placeholderTextColor={DS.color.textMuted}
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
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  errorText: { color: DS.color.textSecondary, fontSize: DS.font.md },

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
  title: { color: DS.color.textPrimary, fontSize: DS.font.xl, fontWeight: '900', flex: 1 },
  deleteBtn: { padding: 8 },
  deleteIcon: { fontSize: 20 },

  form: { padding: 20, gap: 24 },

  avatarPreview: {
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: DS.radius.lg,
    borderWidth: 1,
    borderColor: DS.color.border,
    backgroundColor: DS.color.surface,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  avatarLetter: { fontSize: 30, fontWeight: '900' },

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
  notaDesc: { color: DS.color.green300, fontSize: DS.font.sm, fontWeight: '700', letterSpacing: 1 },

  footer: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: DS.color.border,
  },
});
