/**
 * SplashTransition — transição estilo "live stream" entre telas.
 * Uso: envolva a navegação num contexto, ou use o hook useSplash()
 * para disparar a animação antes de mudar de rota.
 *
 * A animação: cortina verde sobe do fundo, logo pulsa no centro,
 * depois a cortina desce revelando a nova tela.
 */

import React, { useRef, useEffect, createContext, useContext, useState, useCallback } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { DS } from '@/constants/design';

const { height: SCREEN_H, width: SCREEN_W } = Dimensions.get('window');

// ─── Context ──────────────────────────────────────────────────────────────────
interface SplashContextData {
  navigate: (fn: () => void) => void;
}

const SplashContext = createContext<SplashContextData>({ navigate: (fn) => fn() });

export function useSplash() {
  return useContext(SplashContext);
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function SplashProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const curtain = useRef(new Animated.Value(SCREEN_H)).current; // começa embaixo (oculta)
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const pendingNav = useRef<(() => void) | null>(null);

  const navigate = useCallback((fn: () => void) => {
    pendingNav.current = fn;
    setVisible(true);

    // Reset
    curtain.setValue(SCREEN_H);
    logoScale.setValue(0.5);
    logoOpacity.setValue(0);

    // 1. Cortina sobe (cobre tela)
    Animated.timing(curtain, {
      toValue: 0,
      duration: 320,
      useNativeDriver: true,
    }).start(() => {
      // 2. Logo aparece
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 180,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // 3. Navega enquanto a cortina ainda está visível
        pendingNav.current?.();
        pendingNav.current = null;

        // 4. Pausa breve → logo some → cortina desce
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(logoOpacity, {
              toValue: 0,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(curtain, {
              toValue: -SCREEN_H,
              duration: 340,
              delay: 80,
              useNativeDriver: true,
            }),
          ]).start(() => {
            setVisible(false);
            curtain.setValue(SCREEN_H); // reset para próxima vez
          });
        }, 200);
      });
    });
  }, []);

  return (
    <SplashContext.Provider value={{ navigate }}>
      {children}

      {visible && (
        <Animated.View
          style={[styles.curtain, { transform: [{ translateY: curtain }] }]}
          pointerEvents="none"
        >
          {/* Padrão de grama sutil */}
          <View style={styles.grassPattern} />

          {/* Logo central */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: logoOpacity,
                transform: [{ scale: logoScale }],
              },
            ]}
          >
            <Text style={styles.logoEmoji}>⚽</Text>
            <Text style={styles.logoText}>BORA{'\n'}RACHAR</Text>
          </Animated.View>

          {/* Linhas decorativas laterais */}
          <View style={[styles.sideLine, styles.sideLineLeft]} />
          <View style={[styles.sideLine, styles.sideLineRight]} />
        </Animated.View>
      )}
    </SplashContext.Provider>
  );
}

const styles = StyleSheet.create({
  curtain: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_H,
    backgroundColor: '#0A1F0A',
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
    // borda de campo no topo
    borderTopWidth: 4,
    borderTopColor: DS.color.green500,
  },
  grassPattern: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    opacity: 0.04,
    // linhas verticais simulando grama
    borderLeftWidth: SCREEN_W / 8,
    borderRightWidth: SCREEN_W / 8,
    borderColor: '#FFFFFF',
  },
  logoContainer: {
    alignItems: 'center',
    gap: 8,
  },
  logoEmoji: {
    fontSize: 56,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 40,
    letterSpacing: -1,
  },
  sideLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: DS.color.green700,
    opacity: 0.5,
  },
  sideLineLeft:  { left: 24 },
  sideLineRight: { right: 24 },
});
