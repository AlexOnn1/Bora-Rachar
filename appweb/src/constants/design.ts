/**
 * design.ts — Design System do Bora Rachar
 * Fonte única de verdade para cores, espaçamentos e tipografia.
 */

export const DS = {
  // ── Paleta ──────────────────────────────────────────────────────────────────
  color: {
    // Fundos
    bg:         '#060E06',  // fundo principal (quase preto-verde)
    surface:    '#0F1F0F',  // cards e superfícies
    surfaceAlt: '#162016',  // cards secundários
    border:     '#1E321E',  // bordas sutis
    borderBright:'#2E7D32', // borda em destaque

    // Verde — cor principal
    green900:   '#1B5E20',
    green700:   '#2E7D32',
    green500:   '#4CAF50',
    green300:   '#81C784',
    green100:   '#C8E6C9',

    // Texto
    textPrimary:   '#F0FFF0',
    textSecondary: '#6B9E6B',
    textMuted:     '#3A5A3A',

    // Acento laranja (linha/reserva)
    orange:   '#F57F17',
    orangeBg: '#1A1100',

    // Times
    teamColors: [
      '#1565C0', // Azul
      '#2E7D32', // Verde
      '#B71C1C', // Vermelho
      '#E65100', // Laranja
      '#6A1B9A', // Roxo
      '#00695C', // Verde-água
    ],
  },

  // ── Espaçamento ─────────────────────────────────────────────────────────────
  space: {
    xs:  4,
    sm:  8,
    md:  16,
    lg:  24,
    xl:  32,
    xxl: 48,
  },

  // ── Raio de borda ────────────────────────────────────────────────────────────
  radius: {
    sm:   8,
    md:   14,
    lg:   20,
    full: 999,
  },

  // ── Tipografia ───────────────────────────────────────────────────────────────
  font: {
    // tamanhos
    xs:  11,
    sm:  13,
    md:  15,
    lg:  18,
    xl:  24,
    xxl: 36,
    hero: 64,
  },
} as const;

// Cores de posição
export type Posicao =
  | 'Goleiro'
  | 'Zagueiro'
  | 'Lateral Direito'
  | 'Lateral Esquerdo'
  | 'Volante'
  | 'Meia'
  | 'Meia Atacante'
  | 'Ponta Direita'
  | 'Ponta Esquerda'
  | 'Centroavante'
  | 'Segundo Atacante';

export const POSICOES: Posicao[] = [
  'Goleiro', 'Zagueiro', 'Lateral Direito', 'Lateral Esquerdo',
  'Volante', 'Meia', 'Meia Atacante', 'Ponta Direita',
  'Ponta Esquerda', 'Centroavante', 'Segundo Atacante',
];

export const POSICAO_COLORS: Record<Posicao, string> = {
  'Goleiro':           '#F57F17',
  'Zagueiro':          '#1565C0',
  'Lateral Direito':   '#0277BD',
  'Lateral Esquerdo':  '#0277BD',
  'Volante':           '#6A1B9A',
  'Meia':              '#00695C',
  'Meia Atacante':     '#2E7D32',
  'Ponta Direita':     '#558B2F',
  'Ponta Esquerda':    '#558B2F',
  'Centroavante':      '#B71C1C',
  'Segundo Atacante':  '#C62828',
};

export const AVATAR_COLORS = [
  '#1B5E20', '#1565C0', '#6A1B9A', '#B71C1C',
  '#E65100', '#00695C', '#F57F17', '#37474F',
];

export function getAvatarColor(nome: string): string {
  let h = 0;
  for (let i = 0; i < nome.length; i++) h += nome.charCodeAt(i);
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}
