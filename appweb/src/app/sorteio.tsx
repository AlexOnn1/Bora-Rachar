import { useState, useMemo } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useJogadores } from '@/context/JogadoresContext';
import { PlayerSelectItem } from '@/components/ui/PlayerSelectItem';
import { CustomButton } from '@/components/ui/CustomButton';
import { StarRating } from '@/components/ui/StarRating';
import { PosicaoBadge, Posicao } from '@/components/ui/PosicaoBadge';
import { sortearTimes, ResultadoSorteio, JogadorSimples } from '@/utils/sortearTimes';

type Etapa = 'config' | 'resultado';

// ─── Tela principal ───────────────────────────────────────────────────────────
export default function SorteioScreen() {
  const router = useRouter();
  const { jogadores } = useJogadores();

  const [etapa, setEtapa] = useState<Etapa>('config');
  const [selecionados, setSelecionados] = useState<Set<string>>(
    () => new Set(jogadores.map((j) => j.id)) // todos selecionados por padrão
  );
  const [numTimes, setNumTimes] = useState(2);
  const [resultado, setResultado] = useState<ResultadoSorteio | null>(null);

  function toggleJogador(id: string) {
    setSelecionados((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleTodos() {
    if (selecionados.size === jogadores.length) {
      setSelecionados(new Set());
    } else {
      setSelecionados(new Set(jogadores.map((j) => j.id)));
    }
  }

  const jogadoresSelecionados = useMemo(
    () => jogadores.filter((j) => selecionados.has(j.id)),
    [jogadores, selecionados]
  );

  const jogadoresPorTime = Math.floor(jogadoresSelecionados.length / numTimes);
  const sobram = jogadoresSelecionados.length % numTimes;

  function sortear() {
    if (jogadoresSelecionados.length < numTimes * 2) {
      Alert.alert(
        'Jogadores insuficientes',
        `Para ${numTimes} times você precisa de pelo menos ${numTimes * 2} jogadores.`
      );
      return;
    }

    const jogadoresSimples: JogadorSimples[] = jogadoresSelecionados.map((j) => ({
      id: j.id,
      nome: j.nome,
      nota: j.nota,
      posicao: j.posicao,
    }));

    const res = sortearTimes(jogadoresSimples, numTimes);
    setResultado(res);
    setEtapa('resultado');
  }

  function sortearNovamente() {
    if (!resultado) return;
    // Usa os mesmos jogadores e número de times, sorteia de novo
    const jogadoresSimples: JogadorSimples[] = jogadoresSelecionados.map((j) => ({
      id: j.id,
      nome: j.nome,
      nota: j.nota,
      posicao: j.posicao,
    }));
    setResultado(sortearTimes(jogadoresSimples, numTimes));
  }

  if (etapa === 'resultado' && resultado) {
    return (
      <ResultadoView
        resultado={resultado}
        onSortearNovamente={sortearNovamente}
        onVoltar={() => setEtapa('config')}
        onVoltarHome={() => router.back()}
      />
    );
  }

  // ── Etapa de configuração ──────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Voltar</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Sortear Times</Text>
      </View>

      <ScrollView contentContainerStyle={styles.configContent} keyboardShouldPersistTaps="handled">

        {/* Número de times */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>NÚMERO DE TIMES</Text>
          <View style={styles.numTimesRow}>
            {[2, 3, 4, 5, 6].map((n) => (
              <Pressable
                key={n}
                onPress={() => setNumTimes(n)}
                style={[styles.numBtn, numTimes === n && styles.numBtnSelected]}
              >
                <Text style={[styles.numBtnText, numTimes === n && styles.numBtnTextSelected]}>
                  {n}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Preview de distribuição */}
          <View style={styles.previewBox}>
            <Text style={styles.previewText}>
              {jogadoresSelecionados.length} jogadores →{' '}
              <Text style={styles.previewBold}>
                {numTimes} times de {jogadoresPorTime}
              </Text>
              {sobram > 0 && (
                <Text style={styles.previewLinha}>
                  {' '}+ {sobram} na linha
                </Text>
              )}
            </Text>
          </View>
        </View>

        {/* Seleção de jogadores */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionLabel}>JOGADORES</Text>
            <Pressable onPress={toggleTodos}>
              <Text style={styles.toggleTodosText}>
                {selecionados.size === jogadores.length ? 'Desmarcar todos' : 'Selecionar todos'}
              </Text>
            </Pressable>
          </View>

          <Text style={styles.countText}>
            {selecionados.size} de {jogadores.length} selecionados
          </Text>

          {jogadores.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>Nenhum jogador cadastrado.</Text>
            </View>
          ) : (
            <View style={styles.playerList}>
              {jogadores.map((j) => (
                <PlayerSelectItem
                  key={j.id}
                  id={j.id}
                  nome={j.nome}
                  nota={j.nota}
                  posicao={j.posicao}
                  selecionado={selecionados.has(j.id)}
                  onToggle={toggleJogador}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Botão sortear */}
      <View style={styles.footer}>
        <CustomButton label="⚡ Sortear!" onPress={sortear} />
      </View>
    </SafeAreaView>
  );
}

// ─── Tela de resultado ────────────────────────────────────────────────────────
interface ResultadoViewProps {
  resultado: ResultadoSorteio;
  onSortearNovamente: () => void;
  onVoltar: () => void;
  onVoltarHome: () => void;
}

function ResultadoView({ resultado, onSortearNovamente, onVoltar, onVoltarHome }: ResultadoViewProps) {
  const { times, linha } = resultado;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={onVoltar} style={styles.backBtn}>
          <Text style={styles.backText}>← Configurar</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Times Sorteados</Text>
      </View>

      <ScrollView contentContainerStyle={styles.resultContent}>

        {/* Cards dos times */}
        {times.map((time) => (
          <View key={time.label} style={[styles.timeCard, { borderColor: time.cor }]}>
            {/* Header do time */}
            <View style={[styles.timeHeader, { backgroundColor: time.cor }]}>
              <Text style={styles.timeLabel}>{time.label}</Text>
              <View style={styles.timeForca}>
                <Text style={styles.timeForcaLabel}>Força média</Text>
                <StarRating value={Math.round(time.forca)} size={14} />
                <Text style={styles.timeForcaNum}>{time.forca.toFixed(1)}</Text>
              </View>
            </View>

            {/* Jogadores do time */}
            <View style={styles.timeJogadores}>
              {time.jogadores.map((j, idx) => (
                <View key={j.id} style={[styles.timeJogadorRow, idx > 0 && styles.timeJogadorDivider]}>
                  <View style={styles.timeJogadorInfo}>
                    <Text style={styles.timeJogadorNome}>{j.nome}</Text>
                    <PosicaoBadge posicao={j.posicao as Posicao} small />
                  </View>
                  <StarRating value={j.nota} size={13} />
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Linha (reservas) */}
        {linha.length > 0 && (
          <View style={styles.linhaCard}>
            <View style={styles.linhaHeader}>
              <Text style={styles.linhaIcon}>🪑</Text>
              <View>
                <Text style={styles.linhaTitle}>Na Linha</Text>
                <Text style={styles.linhaSubtitle}>Entra quando alguém sair</Text>
              </View>
            </View>
            {linha.map((j, idx) => (
              <View key={j.id} style={[styles.timeJogadorRow, idx > 0 && styles.timeJogadorDivider]}>
                <View style={styles.timeJogadorInfo}>
                  <Text style={styles.timeJogadorNome}>{j.nome}</Text>
                  <PosicaoBadge posicao={j.posicao as Posicao} small />
                </View>
                <StarRating value={j.nota} size={13} />
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Ações */}
      <View style={styles.footer}>
        <CustomButton
          label="🔀 Sortear Novamente"
          onPress={onSortearNovamente}
          variant="secondary"
        />
        <CustomButton
          label="Voltar ao início"
          onPress={onVoltarHome}
          variant="ghost"
        />
      </View>
    </SafeAreaView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0A1A0A' },

  // Header
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
  headerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', flex: 1 },

  // Config
  configContent: { paddingHorizontal: 20, gap: 28, paddingBottom: 20 },
  section: { gap: 12 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionLabel: {
    color: '#B0C4B0',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  toggleTodosText: { color: '#4CAF50', fontSize: 13, fontWeight: '600' },
  countText: { color: '#5A7A5A', fontSize: 13 },

  // Número de times
  numTimesRow: { flexDirection: 'row', gap: 10 },
  numBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2A4A2A',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111E11',
  },
  numBtnSelected: {
    backgroundColor: '#1B5E20',
    borderColor: '#4CAF50',
  },
  numBtnText: { color: '#5A7A5A', fontSize: 18, fontWeight: '700' },
  numBtnTextSelected: { color: '#FFFFFF' },

  // Preview
  previewBox: {
    backgroundColor: '#111E11',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1E2E1E',
  },
  previewText: { color: '#B0C4B0', fontSize: 14 },
  previewBold: { color: '#FFFFFF', fontWeight: '700' },
  previewLinha: { color: '#F57F17', fontWeight: '600' },

  // Lista de jogadores
  playerList: { gap: 8 },
  emptyBox: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#111E11',
    borderRadius: 12,
  },
  emptyText: { color: '#5A7A5A', fontSize: 14 },

  // Footer
  footer: { padding: 20, paddingTop: 8, gap: 10 },

  // Resultado
  resultContent: { paddingHorizontal: 16, gap: 14, paddingBottom: 10 },

  timeCard: {
    borderRadius: 16,
    borderWidth: 2,
    overflow: 'hidden',
    backgroundColor: '#111E11',
  },
  timeHeader: {
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeLabel: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  timeForca: { alignItems: 'flex-end', gap: 2 },
  timeForcaLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },
  timeForcaNum: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },

  timeJogadores: { padding: 12, gap: 0 },
  timeJogadorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  timeJogadorDivider: {
    borderTopWidth: 1,
    borderTopColor: '#1E2E1E',
  },
  timeJogadorInfo: { flex: 1, gap: 3 },
  timeJogadorNome: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },

  // Linha (reservas)
  linhaCard: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F57F17',
    backgroundColor: '#1A1200',
    padding: 14,
    gap: 10,
  },
  linhaHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  linhaIcon: { fontSize: 28 },
  linhaTitle: { color: '#F57F17', fontSize: 17, fontWeight: '800' },
  linhaSubtitle: { color: '#8A6A2A', fontSize: 12 },
});
