import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Alert, Animated, Pressable, ScrollView, StyleSheet, Text, View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useJogadores } from '@/context/JogadoresContext';
import { PlayerSelectItem } from '@/components/ui/PlayerSelectItem';
import { CustomButton } from '@/components/ui/CustomButton';
import { StarRating } from '@/components/ui/StarRating';
import { PosicaoBadge, Posicao } from '@/components/ui/PosicaoBadge';
import { useSplash } from '@/components/SplashTransition';
import { sortearTimes, ResultadoSorteio, JogadorSimples } from '@/utils/sortearTimes';
import { DS } from '@/constants/design';

type Etapa = 'config' | 'resultado';

export default function SorteioScreen() {
  const router = useRouter();
  const { navigate } = useSplash();
  const { jogadores } = useJogadores();

  const [etapa, setEtapa]         = useState<Etapa>('config');
  const [numTimes, setNumTimes]   = useState(2);
  const [resultado, setResultado] = useState<ResultadoSorteio | null>(null);
  const [selecionados, setSelecionados] = useState<Set<string>>(
    () => new Set(jogadores.map((j) => j.id))
  );

  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, []);

  function toggle(id: string) {
    setSelecionados((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleTodos() {
    setSelecionados(
      selecionados.size === jogadores.length
        ? new Set()
        : new Set(jogadores.map((j) => j.id))
    );
  }

  const jogadoresSel = useMemo(
    () => jogadores.filter((j) => selecionados.has(j.id)),
    [jogadores, selecionados]
  );

  const porTime = Math.floor(jogadoresSel.length / numTimes);
  const sobram  = jogadoresSel.length % numTimes;

  function sortear() {
    if (jogadoresSel.length < numTimes * 2) {
      Alert.alert('Poucos jogadores', `Precisa de pelo menos ${numTimes * 2} jogadores para ${numTimes} times.`);
      return;
    }
    const simples: JogadorSimples[] = jogadoresSel.map((j) => ({
      id: j.id, nome: j.nome, nota: j.nota, posicao: j.posicao,
    }));
    setResultado(sortearTimes(simples, numTimes));
    setEtapa('resultado');
  }

  function sortearNovamente() {
    const simples: JogadorSimples[] = jogadoresSel.map((j) => ({
      id: j.id, nome: j.nome, nota: j.nota, posicao: j.posicao,
    }));
    setResultado(sortearTimes(simples, numTimes));
  }

  // ── Tela de Resultado ─────────────────────────────────────────────────────
  if (etapa === 'resultado' && resultado) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Pressable onPress={() => setEtapa('config')} style={styles.backBtn}>
            <Text style={styles.backArrow}>‹</Text>
            <Text style={styles.backText}>Configurar</Text>
          </Pressable>
          <Text style={styles.title}>Times Sorteados</Text>
        </View>

        <ScrollView contentContainerStyle={styles.resultContent} showsVerticalScrollIndicator={false}>

          {resultado.times.map((time) => (
            <View key={time.label} style={[styles.timeCard, { borderColor: time.cor + '80' }]}>
              {/* Header colorido */}
              <View style={[styles.timeHeader, { backgroundColor: time.cor }]}>
                <Text style={styles.timeLabel}>{time.label}</Text>
                <View style={styles.timeForcaBox}>
                  <Text style={styles.timeForcaLabel}>força</Text>
                  <View style={styles.timeForcaRow}>
                    <StarRating value={Math.round(time.forca)} size={13} />
                    <Text style={styles.timeForcaNum}>{time.forca.toFixed(1)}</Text>
                  </View>
                </View>
              </View>

              {/* Jogadores */}
              {time.jogadores.map((j, idx) => (
                <View key={j.id} style={[styles.jogRow, idx > 0 && styles.jogDivider]}>
                  <View style={styles.jogInfo}>
                    <Text style={styles.jogNome}>{j.nome}</Text>
                    <PosicaoBadge posicao={j.posicao as Posicao} small />
                  </View>
                  <StarRating value={j.nota} size={13} />
                </View>
              ))}
            </View>
          ))}

          {/* Linha (reservas) */}
          {resultado.linha.length > 0 && (
            <View style={styles.linhaCard}>
              <View style={styles.linhaHeader}>
                <Text style={styles.linhaEmoji}>🪑</Text>
                <View>
                  <Text style={styles.linhaTitle}>Na Linha</Text>
                  <Text style={styles.linhaSub}>Entra quando alguém sair</Text>
                </View>
              </View>
              {resultado.linha.map((j, idx) => (
                <View key={j.id} style={[styles.jogRow, idx > 0 && styles.jogDivider]}>
                  <View style={styles.jogInfo}>
                    <Text style={styles.jogNome}>{j.nome}</Text>
                    <PosicaoBadge posicao={j.posicao as Posicao} small />
                  </View>
                  <StarRating value={j.nota} size={13} />
                </View>
              ))}
            </View>
          )}

          <View style={{ height: 8 }} />
        </ScrollView>

        <View style={styles.footer}>
          <CustomButton label="Novo Sorteio" icon="🔀" onPress={sortearNovamente} variant="secondary" />
          <CustomButton label="Início" icon="🏠" onPress={() => navigate(() => router.back())} variant="ghost" />
        </View>
      </SafeAreaView>
    );
  }

  // ── Tela de Configuração ──────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <Animated.View style={[{ flex: 1 }, { opacity }]}>
        <View style={styles.header}>
          <Pressable onPress={() => navigate(() => router.back())} style={styles.backBtn}>
            <Text style={styles.backArrow}>‹</Text>
            <Text style={styles.backText}>Voltar</Text>
          </Pressable>
          <Text style={styles.title}>Sortear Times</Text>
        </View>

        <ScrollView contentContainerStyle={styles.configContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* Nº de times */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>NÚMERO DE TIMES</Text>
            <View style={styles.numRow}>
              {[2, 3, 4, 5, 6].map((n) => (
                <Pressable
                  key={n}
                  onPress={() => setNumTimes(n)}
                  style={[styles.numBtn, numTimes === n && styles.numBtnOn]}
                >
                  <Text style={[styles.numBtnText, numTimes === n && styles.numBtnTextOn]}>{n}</Text>
                </Pressable>
              ))}
            </View>

            {/* Preview de distribuição */}
            <View style={styles.previewBox}>
              <Text style={styles.previewText}>
                <Text style={styles.previewNum}>{jogadoresSel.length}</Text>
                {' jogadores → '}
                <Text style={styles.previewNum}>{numTimes} times de {porTime}</Text>
                {sobram > 0 && (
                  <Text style={styles.previewLinha}>{' + '}{sobram} na linha 🪑</Text>
                )}
              </Text>
            </View>
          </View>

          {/* Jogadores */}
          <View style={styles.section}>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionLabel}>JOGADORES ({selecionados.size}/{jogadores.length})</Text>
              <Pressable onPress={toggleTodos}>
                <Text style={styles.toggleText}>
                  {selecionados.size === jogadores.length ? 'Desmarcar todos' : 'Todos'}
                </Text>
              </Pressable>
            </View>

            {jogadores.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>Nenhum jogador cadastrado.</Text>
              </View>
            ) : (
              <View style={styles.playerList}>
                {jogadores.map((j) => (
                  <PlayerSelectItem
                    key={j.id}
                    id={j.id} nome={j.nome} nota={j.nota} posicao={j.posicao}
                    selecionado={selecionados.has(j.id)}
                    onToggle={toggle}
                  />
                ))}
              </View>
            )}
          </View>

        </ScrollView>

        <View style={styles.footer}>
          <CustomButton label="⚡ Sortear!" onPress={sortear} />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
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
  title: { color: DS.color.textPrimary, fontSize: DS.font.xl, fontWeight: '900', flex: 1 },

  // Config
  configContent: { padding: 16, gap: 24, paddingBottom: 8 },
  section: { gap: 12 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionLabel: { color: DS.color.textSecondary, fontSize: DS.font.xs, fontWeight: '800', letterSpacing: 2 },
  toggleText: { color: DS.color.green500, fontSize: DS.font.sm, fontWeight: '600' },

  numRow: { flexDirection: 'row', gap: 10 },
  numBtn: {
    flex: 1,
    height: 52,
    borderRadius: DS.radius.md,
    borderWidth: 1.5,
    borderColor: DS.color.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DS.color.surface,
  },
  numBtnOn: { backgroundColor: DS.color.green900, borderColor: DS.color.green500 },
  numBtnText: { color: DS.color.textMuted, fontSize: DS.font.lg, fontWeight: '800' },
  numBtnTextOn: { color: DS.color.green300 },

  previewBox: {
    backgroundColor: DS.color.surface,
    borderRadius: DS.radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: DS.color.border,
  },
  previewText: { color: DS.color.textSecondary, fontSize: DS.font.sm, lineHeight: 22 },
  previewNum:  { color: DS.color.textPrimary, fontWeight: '800' },
  previewLinha:{ color: DS.color.orange, fontWeight: '700' },

  playerList: { gap: 8 },
  emptyBox: {
    padding: 20, alignItems: 'center',
    backgroundColor: DS.color.surface, borderRadius: DS.radius.md,
  },
  emptyText: { color: DS.color.textSecondary, fontSize: DS.font.sm },

  footer: {
    padding: 16, paddingTop: 8,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: DS.color.border,
  },

  // Resultado
  resultContent: { padding: 16, gap: 12, paddingBottom: 8 },

  timeCard: {
    borderRadius: DS.radius.lg,
    borderWidth: 1.5,
    overflow: 'hidden',
    backgroundColor: DS.color.surface,
  },
  timeHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeLabel: { color: '#FFFFFF', fontSize: DS.font.xl, fontWeight: '900', letterSpacing: 0.5 },
  timeForcaBox: { alignItems: 'flex-end', gap: 2 },
  timeForcaLabel: { color: 'rgba(255,255,255,0.6)', fontSize: DS.font.xs, textTransform: 'uppercase', letterSpacing: 1 },
  timeForcaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timeForcaNum: { color: '#FFFFFF', fontSize: DS.font.sm, fontWeight: '800' },

  jogRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  jogDivider: { borderTopWidth: 1, borderTopColor: DS.color.border },
  jogInfo: { flex: 1, gap: 4 },
  jogNome: { color: DS.color.textPrimary, fontSize: DS.font.md, fontWeight: '600' },

  linhaCard: {
    borderRadius: DS.radius.lg,
    borderWidth: 1.5,
    borderColor: DS.color.orange + '80',
    backgroundColor: DS.color.orangeBg,
    overflow: 'hidden',
  },
  linhaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: DS.color.orange + '30',
  },
  linhaEmoji: { fontSize: 26 },
  linhaTitle: { color: DS.color.orange, fontSize: DS.font.lg, fontWeight: '800' },
  linhaSub:   { color: DS.color.orange + '99', fontSize: DS.font.xs },
});
