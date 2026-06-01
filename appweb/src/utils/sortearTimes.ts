/**
 * sortearTimes.ts
 * Algoritmo de sorteio de times equilibrados pela nota dos jogadores.
 *
 * Estratégia: Snake Draft
 * - Ordena jogadores por nota (maior → menor)
 * - Distribui em serpentina: time 0, 1, 2 ... n, n, n-1 ... 0, 0, 1 ...
 * - Isso garante que a soma das notas fique próxima em todos os times
 * - Jogadores "na linha" (reservas) são os que sobram do número quebrado
 */

export interface JogadorSimples {
  id: string;
  nome: string;
  nota: number;
  posicao: string;
}

export interface Time {
  label: string;        // "Time A", "Time B", ...
  cor: string;          // cor do card
  jogadores: JogadorSimples[];
  forca: number;        // média das notas (1 casa decimal)
}

export interface ResultadoSorteio {
  times: Time[];
  linha: JogadorSimples[];  // reservas (número quebrado)
}

// Cores distintas para cada time (até 8 times)
const CORES_TIMES = [
  '#1565C0', // Azul
  '#2E7D32', // Verde
  '#B71C1C', // Vermelho
  '#E65100', // Laranja
  '#6A1B9A', // Roxo
  '#00695C', // Verde-água
  '#F57F17', // Amarelo-escuro
  '#37474F', // Cinza-ardósia
];

const LETRAS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

function calcularForca(jogadores: JogadorSimples[]): number {
  if (jogadores.length === 0) return 0;
  const soma = jogadores.reduce((acc, j) => acc + j.nota, 0);
  return Math.round((soma / jogadores.length) * 10) / 10;
}

export function sortearTimes(
  jogadores: JogadorSimples[],
  numTimes: number
): ResultadoSorteio {
  if (jogadores.length === 0 || numTimes < 2) {
    return { times: [], linha: [] };
  }

  // Embaralha levemente antes de ordenar (para jogadores de mesma nota não ficarem sempre juntos)
  const embaralhados = [...jogadores].sort(() => Math.random() - 0.5);

  // Ordena por nota decrescente
  const ordenados = embaralhados.sort((a, b) => b.nota - a.nota);

  // Calcula jogadores por time e "sobras" (linha)
  const jogadoresPorTime = Math.floor(ordenados.length / numTimes);
  const totalNaLinha = ordenados.length % numTimes;

  // Os últimos `totalNaLinha` ficam na linha (reservas)
  const jogadoresNoSorteio = ordenados.slice(0, ordenados.length - totalNaLinha);
  const naLinha = ordenados.slice(ordenados.length - totalNaLinha);

  // Inicializa times
  const times: Time[] = Array.from({ length: numTimes }, (_, i) => ({
    label: `Time ${LETRAS[i]}`,
    cor: CORES_TIMES[i % CORES_TIMES.length],
    jogadores: [],
    forca: 0,
  }));

  // Snake draft
  let direcao = 1;
  let timeAtual = 0;

  for (const jogador of jogadoresNoSorteio) {
    times[timeAtual].jogadores.push(jogador);

    // Avança na direção atual
    timeAtual += direcao;

    // Inverte ao chegar nas extremidades
    if (timeAtual >= numTimes) {
      timeAtual = numTimes - 1;
      direcao = -1;
    } else if (timeAtual < 0) {
      timeAtual = 0;
      direcao = 1;
    }
  }

  // Calcula força de cada time
  times.forEach((t) => {
    t.forca = calcularForca(t.jogadores);
  });

  return { times, linha: naLinha };
}
