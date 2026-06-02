import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Animated, Modal, Pressable, ScrollView,
  StyleSheet, Text, TextInput, View, Vibration,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DS } from '@/constants/design';

// ─── Types ────────────────────────────────────────────────────────────────────
interface TimeInfo { label: string; cor: string; }

interface Props {
  times: TimeInfo[];
  visible: boolean;
  onClose: () => void;
}

// ─── Digit Display (LED style) ────────────────────────────────────────────────
function LedDigit({ value, size = 'lg' }: { value: string; size?: 'lg' | 'sm' }) {
  const isLg = size === 'lg';
  return (
    <Text style={[styles.ledDigit, isLg ? styles.ledLg : styles.ledSm]}>
      {value}
    </Text>
  );
}

function LedClock({ seconds, size = 'lg' }: { seconds: number; size?: 'lg' | 'sm' }) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return (
    <View style={styles.ledRow}>
      <LedDigit value={m[0]} size={size} />
      <LedDigit value={m[1]} size={size} />
      <Text style={[styles.ledColon, size === 'lg' ? styles.ledLg : styles.ledSm]}>:</Text>
      <LedDigit value={s[0]} size={size} />
      <LedDigit value={s[1]} size={size} />
    </View>
  );
}

// ─── Score Button ─────────────────────────────────────────────────────────────
function ScoreButton({
  score, cor, label, onIncrement, onDecrement,
}: {
  score: number; cor: string; label: string;
  onIncrement: () => void; onDecrement: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  function pulse() {
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.18, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1,    duration: 100, useNativeDriver: true }),
    ]).start();
  }

  function handlePlus() { pulse(); onIncrement(); Vibration.vibrate(30); }
  function handleMinus() { onDecrement(); Vibration.vibrate(10); }

  return (
    <View style={styles.scoreCol}>
      {/* Team name */}
      <View style={[styles.teamBadge, { backgroundColor: cor }]}>
        <Text style={styles.teamBadgeText} numberOfLines={1}>{label}</Text>
      </View>

      {/* Score display */}
      <Animated.View style={[styles.scoreBox, { borderColor: cor + '60', transform: [{ scale }] }]}>
        <Text style={[styles.scoreNum, { color: cor }]}>
          {score.toString().padStart(2, '0')}
        </Text>
      </Animated.View>

      {/* Buttons */}
      <Pressable
        onPress={handlePlus}
        style={({ pressed }) => [styles.goalBtn, { backgroundColor: cor, opacity: pressed ? 0.8 : 1 }]}
      >
        <Text style={styles.goalBtnText}>+ GOL</Text>
      </Pressable>

      <Pressable
        onPress={handleMinus}
        disabled={score === 0}
        style={({ pressed }) => [
          styles.undoBtn,
          { borderColor: cor + '60', opacity: score === 0 ? 0.3 : pressed ? 0.6 : 1 },
        ]}
      >
        <Text style={[styles.undoBtnText, { color: cor }]}>anular</Text>
      </Pressable>
    </View>
  );
}

// ─── Setup Modal ──────────────────────────────────────────────────────────────
function SetupModal({
  visible,
  onConfirm,
}: {
  visible: boolean;
  onConfirm: (minutes: number) => void;
}) {
  const [input, setInput] = useState('10');
  const presets = [5, 10, 15, 20, 30];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.setupCard}>
          {/* Title */}
          <View style={styles.setupHeader}>
            <Text style={styles.setupEmoji}>⏱️</Text>
            <Text style={styles.setupTitle}>Duração da Partida</Text>
            <Text style={styles.setupSub}>Quantos minutos terá o jogo?</Text>
          </View>

          {/* Quick presets */}
          <View style={styles.presetRow}>
            {presets.map((p) => (
              <Pressable
                key={p}
                onPress={() => setInput(String(p))}
                style={[
                  styles.presetBtn,
                  input === String(p) && styles.presetBtnOn,
                ]}
              >
                <Text style={[styles.presetText, input === String(p) && styles.presetTextOn]}>
                  {p}′
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Manual input */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.minuteInput}
              value={input}
              onChangeText={(v) => setInput(v.replace(/[^0-9]/g, ''))}
              keyboardType="number-pad"
              maxLength={3}
              placeholderTextColor={DS.color.textMuted}
              placeholder="00"
            />
            <Text style={styles.minuteLabel}>minutos</Text>
          </View>

          {/* Confirm */}
          <Pressable
            onPress={() => {
              const mins = Math.max(1, Math.min(999, parseInt(input || '10', 10)));
              onConfirm(mins);
            }}
            style={({ pressed }) => [styles.startMatchBtn, { opacity: pressed ? 0.85 : 1 }]}
          >
            <Text style={styles.startMatchText}>🏁  INICIAR PARTIDA</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export function PartidaScreen({ times, visible, onClose }: Props) {
  const [phase, setPhase] = useState<'setup' | 'running'>('setup');
  const [totalSeconds, setTotalSeconds] = useState(600);
  const [remaining, setRemaining]       = useState(600);
  const [running, setRunning]           = useState(false);
  const [scores, setScores]             = useState<number[]>([]);
  const [ended, setEnded]               = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const flashAnim   = useRef(new Animated.Value(1)).current;

  // init scores when times change
  useEffect(() => {
    setScores(times.map(() => 0));
  }, [times]);

  // timer tick
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            setEnded(true);
            Vibration.vibrate([0, 200, 100, 200, 100, 500]);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  // flash when ended
  useEffect(() => {
    if (ended) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(flashAnim, { toValue: 0.2, duration: 400, useNativeDriver: true }),
          Animated.timing(flashAnim, { toValue: 1,   duration: 400, useNativeDriver: true }),
        ])
      ).start();
    } else {
      flashAnim.setValue(1);
    }
  }, [ended]);

  function handleSetup(minutes: number) {
    const secs = minutes * 60;
    setTotalSeconds(secs);
    setRemaining(secs);
    setRunning(false);
    setEnded(false);
    setScores(times.map(() => 0));
    setPhase('running');
    // auto-start
    setTimeout(() => setRunning(true), 300);
  }

  function handleClose() {
    setRunning(false);
    setPhase('setup');
    setEnded(false);
    onClose();
  }

  function incrementScore(idx: number) {
    setScores((prev) => prev.map((s, i) => (i === idx ? s + 1 : s)));
  }
  function decrementScore(idx: number) {
    setScores((prev) => prev.map((s, i) => (i === idx ? Math.max(0, s - 1) : s)));
  }

  const progress = totalSeconds > 0 ? remaining / totalSeconds : 0;
  const isLow = remaining <= 60 && remaining > 0;
  const clockColor = ended ? '#B71C1C' : isLow ? DS.color.orange : DS.color.green300;

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <SafeAreaView style={styles.safe}>

        {/* Setup modal */}
        <SetupModal visible={phase === 'setup'} onConfirm={handleSetup} />

        {/* ── Header ── */}
        <View style={styles.header}>
          <Pressable onPress={handleClose} style={styles.closeBtn}>
            <Text style={styles.closeTxt}>✕</Text>
          </Pressable>
          <Text style={styles.headerTitle}>PLACAR</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>

          {/* ── Scoreboard panel ── */}
          <View style={styles.scoreboard}>

            {/* Progress bar */}
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, {
                width: `${progress * 100}%` as any,
                backgroundColor: ended ? '#B71C1C' : isLow ? DS.color.orange : DS.color.green500,
              }]} />
            </View>

            {/* Clock */}
            <Animated.View style={[styles.clockBox, { opacity: ended ? flashAnim : 1 }]}>
              {ended ? (
                <Text style={[styles.endedLabel]}>TEMPO ESGOTADO</Text>
              ) : (
                <LedClock seconds={remaining} />
              )}
              {!ended && (
                <Text style={[styles.halfLabel, { color: clockColor }]}>
                  {isLow ? '⚠️  ÚLTIMOS 60s' : 'EM ANDAMENTO'}
                </Text>
              )}
            </Animated.View>

            {/* Score columns */}
            <View style={styles.scoresRow}>
              {times.map((t, i) => (
                <ScoreButton
                  key={t.label}
                  score={scores[i] ?? 0}
                  cor={t.cor}
                  label={t.label}
                  onIncrement={() => incrementScore(i)}
                  onDecrement={() => decrementScore(i)}
                />
              ))}
            </View>

            {/* VS divider */}
            {times.length === 2 && (
              <View style={styles.vsDivider}>
                <View style={styles.vsDivLine} />
                <Text style={styles.vsTxt}>VS</Text>
                <View style={styles.vsDivLine} />
              </View>
            )}
          </View>

          {/* ── Timer controls ── */}
          <View style={styles.controls}>
            {!ended ? (
              <Pressable
                onPress={() => setRunning((r) => !r)}
                style={({ pressed }) => [
                  styles.ctrlBtn,
                  running ? styles.ctrlBtnPause : styles.ctrlBtnPlay,
                  { opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <Text style={styles.ctrlBtnText}>
                  {running ? '⏸  PAUSAR' : '▶  RETOMAR'}
                </Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => {
                  setPhase('setup');
                  setEnded(false);
                  setRunning(false);
                }}
                style={({ pressed }) => [styles.ctrlBtn, styles.ctrlBtnPlay, { opacity: pressed ? 0.8 : 1 }]}
              >
                <Text style={styles.ctrlBtnText}>🔄  NOVA PARTIDA</Text>
              </Pressable>
            )}
          </View>

        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#05080A' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1A2A1A',
  },
  headerTitle: {
    color: DS.color.green300,
    fontSize: DS.font.sm,
    fontWeight: '900',
    letterSpacing: 4,
  },
  closeBtn: { padding: 8 },
  closeTxt: { color: DS.color.textSecondary, fontSize: 18, fontWeight: '700' },

  body: { padding: 16, gap: 16, paddingBottom: 32, flexGrow: 1, justifyContent: 'center' },

  // ── Scoreboard ──
  scoreboard: {
    backgroundColor: '#0A1010',
    borderRadius: DS.radius.lg,
    borderWidth: 2,
    borderColor: '#1A2E2A',
    overflow: 'hidden',
    gap: 0,
  },

  progressTrack: { height: 4, backgroundColor: '#111' },
  progressFill:  { height: 4, borderRadius: 2 },

  clockBox: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 12,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#1A2E2A',
  },
  endedLabel: {
    color: '#B71C1C',
    fontSize: DS.font.lg,
    fontWeight: '900',
    letterSpacing: 4,
  },
  halfLabel: {
    fontSize: DS.font.xs,
    fontWeight: '700',
    letterSpacing: 2,
  },

  // LED
  ledRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  ledDigit: {
    fontFamily: 'monospace',
    color: DS.color.green300,
    textShadowColor: DS.color.green500,
    textShadowRadius: 12,
    textShadowOffset: { width: 0, height: 0 },
  },
  ledLg: { fontSize: 72, lineHeight: 80, fontWeight: '900' },
  ledSm: { fontSize: 32, lineHeight: 36, fontWeight: '900' },
  ledColon: { color: DS.color.green500, fontWeight: '900' },

  // VS divider
  vsDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
    marginTop: -6,
  },
  vsDivLine: { flex: 1, height: 1, backgroundColor: '#1A2E2A' },
  vsTxt: { color: '#1A2E2A', fontSize: DS.font.xs, fontWeight: '900', letterSpacing: 2 },

  // Scores
  scoresRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    gap: 8,
    flexWrap: 'wrap',
  },
  scoreCol: { alignItems: 'center', gap: 10, minWidth: 120, flex: 1 },
  teamBadge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: DS.radius.full,
    maxWidth: 140,
  },
  teamBadgeText: {
    color: '#fff',
    fontSize: DS.font.sm,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  scoreBox: {
    width: 100,
    height: 90,
    borderRadius: DS.radius.md,
    borderWidth: 2,
    backgroundColor: '#050D0D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNum: {
    fontSize: 62,
    fontWeight: '900',
    fontFamily: 'monospace',
    lineHeight: 70,
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
  },
  goalBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: DS.radius.md,
    width: '100%',
    alignItems: 'center',
  },
  goalBtnText: { color: '#fff', fontSize: DS.font.sm, fontWeight: '900', letterSpacing: 1 },
  undoBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: DS.radius.sm,
    borderWidth: 1,
    width: '100%',
    alignItems: 'center',
  },
  undoBtnText: { fontSize: DS.font.xs, fontWeight: '700', letterSpacing: 1 },

  // ── Controls ──
  controls: { gap: 10 },
  ctrlBtn: {
    paddingVertical: 16,
    borderRadius: DS.radius.md,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  ctrlBtnPlay:  { backgroundColor: DS.color.green900, borderColor: DS.color.green500 },
  ctrlBtnPause: { backgroundColor: '#1A1000', borderColor: DS.color.orange },
  ctrlBtnText:  { color: '#fff', fontSize: DS.font.md, fontWeight: '900', letterSpacing: 2 },

  // ── Setup Modal ──
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  setupCard: {
    width: '100%',
    backgroundColor: '#0A1210',
    borderRadius: DS.radius.lg,
    borderWidth: 2,
    borderColor: DS.color.green700,
    padding: 24,
    gap: 20,
  },
  setupHeader: { alignItems: 'center', gap: 6 },
  setupEmoji:  { fontSize: 40 },
  setupTitle:  { color: DS.color.textPrimary, fontSize: DS.font.xl, fontWeight: '900' },
  setupSub:    { color: DS.color.textSecondary, fontSize: DS.font.sm },

  presetRow: { flexDirection: 'row', gap: 8 },
  presetBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: DS.radius.md,
    borderWidth: 1.5,
    borderColor: DS.color.border,
    alignItems: 'center',
    backgroundColor: DS.color.surface,
  },
  presetBtnOn: { backgroundColor: DS.color.green900, borderColor: DS.color.green500 },
  presetText:    { color: DS.color.textMuted, fontSize: DS.font.sm, fontWeight: '800' },
  presetTextOn:  { color: DS.color.green300 },

  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 12, justifyContent: 'center' },
  minuteInput: {
    backgroundColor: DS.color.surface,
    borderWidth: 2,
    borderColor: DS.color.green700,
    borderRadius: DS.radius.md,
    color: DS.color.green300,
    fontSize: DS.font.xxl,
    fontWeight: '900',
    fontFamily: 'monospace',
    textAlign: 'center',
    width: 100,
    paddingVertical: 10,
  },
  minuteLabel: { color: DS.color.textSecondary, fontSize: DS.font.md, fontWeight: '600' },

  startMatchBtn: {
    backgroundColor: DS.color.green700,
    borderWidth: 1.5,
    borderColor: DS.color.green500,
    borderRadius: DS.radius.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  startMatchText: { color: '#fff', fontSize: DS.font.md, fontWeight: '900', letterSpacing: 2 },
});
