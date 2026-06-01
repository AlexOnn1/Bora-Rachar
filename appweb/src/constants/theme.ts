import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

// Corrigido: fallback explícito para evitar undefined em web/SSR
export const Fonts = {
  sans: Platform.select({ ios: 'system-ui', web: 'sans-serif', default: 'normal' }) ?? 'normal',
  serif: Platform.select({ ios: 'ui-serif', web: 'serif', default: 'serif' }) ?? 'serif',
  rounded: Platform.select({ ios: 'ui-rounded', web: 'sans-serif', default: 'normal' }) ?? 'normal',
  mono: Platform.select({ ios: 'ui-monospace', web: 'monospace', default: 'monospace' }) ?? 'monospace',
};

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;