# ⚽ Bora Rachar!
> Organize. Sorteie. Jogue.

Aplicativo mobile desenvolvido como projeto acadêmico para organizar
rachões de futebol. Com ele é possível cadastrar jogadores com nível
e posição, sortear times equilibrados automaticamente e acompanhar
a partida com placar e cronômetro em tempo real.

---

## 👥 Equipe

| Membro | Responsabilidade |
|--------|-----------------|
| Alexsander  | Front-End (React Native / Expo) / Tech Leader - Trello |
| Fayrlysson  | Back-End / Banco de Dados |
| Maria Clara | Design / Figma |
| Saul & Davi | Documentação / testes |

---

## 🎯 Objetivo

Facilitar a organização de partidas amadoras de futebol, eliminando
a subjetividade na formação de times e centralizando o gerenciamento
dos jogadores em um único aplicativo offline, simples e intuitivo.

---

## 🗺️ Requisitos do Projeto

### Funcionais
- Cadastrar jogadores com nome, nível (1–5 estrelas) e posição
- Listar, editar e excluir jogadores cadastrados
- Sortear times equilibrados com base na média de nível dos jogadores
- Permitir que o usuário defina o número de times no sorteio
- Tratar número quebrado de jogadores (reservas ficam "na linha")
- Cronômetro de partida configurável com placar por time

### Não Funcionais
- Aplicativo 100% offline (sem necessidade de internet)
- Dados persistidos localmente no dispositivo (AsyncStorage)
- Interface responsiva e otimizada para uso mobile
- Estrutura monolítica com Expo Router

---

## 🛠️ Stack Tecnológica

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| React Native | 0.79 | Base do aplicativo mobile |
| Expo | 56 | Plataforma de desenvolvimento e build |
| Expo Router | 4 | Navegação entre telas (file-based routing) |
| TypeScript | 5 | Tipagem estática do código |
| AsyncStorage | 2 | Persistência local dos dados no dispositivo |
| EAS Build | 12+ | Compilação do APK para Android |

---

## 📁 Estrutura de Pastas

```
appweb/
├── assets/
│   ├── favicons/          # Ícones do app (web e Android)
│   └── images/            # Logo e imagens estáticas
│
├── src/
│   ├── app/               # Telas do app (Expo Router)
│   │   ├── _layout.tsx    # Layout raiz — providers globais
│   │   ├── index.tsx      # Tela inicial (Home)
│   │   ├── sorteio.tsx    # Sorteio de times
│   │   ├── partida.tsx    # Cronômetro e placar
│   │   └── jogadores/
│   │       ├── index.tsx  # Lista de jogadores
│   │       ├── novo.tsx   # Cadastro de jogador
│   │       └── [id].tsx   # Edição/exclusão de jogador
│   │
│   ├── components/
│   │   ├── SplashTransition.tsx   # Transição animada entre telas
│   │   └── ui/
│   │       ├── CustomButton.tsx   # Botão reutilizável com variantes
│   │       ├── StarRating.tsx     # Exibição e input de estrelas
│   │       ├── PosicaoBadge.tsx   # Badge e seletor de posição
│   │       ├── PlayerCard.tsx     # Card do jogador na lista
│   │       └── PlayerSelectItem.tsx # Item selecionável no sorteio
│   │
│   ├── context/
│   │   └── JogadoresContext.tsx  # Estado global + persistência
│   │
│   ├── constants/
│   │   └── design.ts      # Design system (cores, espaçamentos, tipografia)
│   │
│   └── utils/
│       └── sortearTimes.ts # Algoritmo de sorteio equilibrado
│
├── app.json               # Configurações do Expo (nome, ícone, versão)
├── eas.json               # Configurações de build (EAS)
└── package.json           # Dependências do projeto
```

---

## 📱 Funcionalidades

### 🏠 Tela Inicial
Tela de entrada do app com logo, acesso rápido ao sorteio e navegação
para cadastro e lista de jogadores. Conta com animação de entrada e
decoração inspirada em campo de futebol.

---

### 👥 Gestão de Jogadores

**Cadastro**
- Nome do jogador
- Nível de 1 a 5 estrelas com descrição textual:
  - ⭐ Iniciante
  - ⭐⭐ Básico
  - ⭐⭐⭐ Médio
  - ⭐⭐⭐⭐ Bom
  - ⭐⭐⭐⭐⭐ Craque
- Posição em campo, com 11 opções disponíveis:

| Posição | Cor |
|---------|-----|
| Goleiro | Laranja |
| Zagueiro | Azul escuro |
| Lateral Direito | Azul |
| Lateral Esquerdo | Azul |
| Volante | Roxo |
| Meia | Verde-água |
| Meia Atacante | Verde |
| Ponta Direita | Verde oliva |
| Ponta Esquerda | Verde oliva |
| Centroavante | Vermelho |
| Segundo Atacante | Vermelho escuro |

**Listagem**
- Lista todos os jogadores cadastrados com avatar, nome, posição e nível
- Contador de jogadores no cabeçalho
- Acesso rápido ao cadastro de novo jogador

**Edição e Exclusão**
- Edição de todos os campos do jogador
- Exclusão com confirmação via Alert
- Preview do avatar com a inicial do nome na tela de edição

---

### ⚡ Sorteio de Times

**Configuração**
- Seleção do número de times (2 a 6)
- Preview em tempo real da distribuição:
  `ex: 7 jogadores → 2 times de 3 + 1 na linha 🪑`
- Seleção individual de quais jogadores participam
- Opção de selecionar/desmarcar todos com um toque

**Algoritmo — Snake Draft**
O sorteio utiliza o método Snake Draft para garantir o máximo
equilíbrio entre os times:

```
1. Jogadores são ordenados por nota (maior → menor)
2. Um leve embaralhamento é aplicado entre jogadores de mesma nota
3. A distribuição segue em serpentina:

   Rodada 1 →  Time A  Time B  Time C
   Rodada 2 →  Time C  Time B  Time A
   Rodada 3 →  Time A  Time B  Time C ...

4. Jogadores que sobram (número quebrado) vão para a "Linha"
   e entram quando algum jogador precisar sair
```

**Resultado**
- Cards coloridos por time com nome, posição e estrelas de cada jogador
- Força média do time calculada e exibida com estrelas
- Card especial para jogadores na linha (reservas)
- Opção de sortear novamente com os mesmos jogadores

---

### ⏱️ Cronômetro e Placar

**Configuração da Partida**
- Duração configurável por tempo (1 a 120 minutos)
- Sugestões rápidas: 10, 20, 30 e 45 minutos
- Preview dos times que vão se enfrentar

**Durante a Partida**
- Cronômetro estilo placar de LED com dígitos digitais
- Barra de progresso do tempo
- Indicador de 1º ou 2º tempo
- Alerta visual e vibração nos últimos 60 segundos
- Placar individual por time com botões de gol
- Correção de gol (remover ponto)
- Pause e retomada a qualquer momento
- Reinício para o 2º tempo

**Encerramento**
- Tela de resultado com vencedor ou empate
- Placar final de cada time

---

## 💾 Persistência de Dados

O app é **100% offline** — nenhuma requisição externa é feita durante
o uso. Os dados dos jogadores são salvos diretamente no dispositivo
usando `AsyncStorage`, a solução oficial do React Native para
armazenamento local chave-valor.

**Como funciona:**
```
Abrir o app  →  AsyncStorage.getItem()  →  carrega lista salva
Cadastrar    →  AsyncStorage.setItem()  →  salva lista atualizada
Editar       →  AsyncStorage.setItem()  →  salva lista atualizada
Excluir      →  AsyncStorage.setItem()  →  salva lista atualizada
```

Os dados persistem mesmo após fechar o app, reiniciar o celular
ou atualizar o aplicativo. A chave usada no storage é:
```
@borarachar:jogadores
```

---

## 🎨 Design System

Todas as decisões visuais do app estão centralizadas no arquivo
`src/constants/design.ts`, evitando valores mágicos espalhados
pelo código e facilitando futuras alterações de tema.

**Paleta de cores**
| Token | Valor | Uso |
|-------|-------|-----|
| `bg` | `#060E06` | Fundo principal |
| `surface` | `#0F1F0F` | Cards e superfícies |
| `green700` | `#2E7D32` | Cor primária — botões e destaques |
| `green500` | `#4CAF50` | Cor de acento — ícones e links |
| `textPrimary` | `#F0FFF0` | Texto principal |
| `textSecondary` | `#6B9E6B` | Texto secundário |
| `orange` | `#F57F17` | Linha / reservas |

**Tipografia**
| Token | Tamanho | Uso |
|-------|---------|-----|
| `xs` | 11px | Labels, badges pequenos |
| `sm` | 13px | Texto secundário |
| `md` | 15px | Texto padrão |
| `lg` | 18px | Subtítulos |
| `xl` | 24px | Títulos de tela |
| `hero` | 64px | Título da home |

**Espaçamento e bordas**
Seguem uma escala consistente de `xs` (4px) a `xxl` (48px),
com raios de borda de `sm` (8px) a `full` (999px para pílulas).

---

## ✨ Transições entre Telas

O app utiliza um sistema de transição personalizado chamado
`SplashTransition`, inspirado em transições de transmissões ao vivo
(live streams).

**Funcionamento da animação:**
```
1. Cortina verde sobe cobrindo a tela atual     (320ms)
2. Logo ⚽ BORA RACHAR aparece no centro        (spring animation)
3. Navegação para a nova tela ocorre por baixo
4. Logo some suavemente                          (150ms)
5. Cortina desce revelando a nova tela           (340ms)
```

O hook `useSplash()` é disponibilizado globalmente via Context,
e substituiu o `router.push()` padrão do Expo Router em todas
as navegações:

```typescript
// Em vez de:
router.push('/jogadores')

// Usamos:
const { navigate } = useSplash()
navigate(() => router.push('/jogadores'))
```

---

## 🤔 Por que essas tecnologias?

**React Native + Expo**
Escolhemos React Native por permitir desenvolver um app mobile real
para Android (e iOS) usando JavaScript/TypeScript — linguagem já
familiar à equipe. O Expo adiciona uma camada de ferramentas que
elimina a necessidade de configurar Android Studio para rodar e
testar o projeto, bastando escanear um QR code com o Expo Go.

**Expo Router**
O roteamento baseado em arquivos do Expo Router segue a mesma
convenção do Next.js, que a equipe já conhecia do desenvolvimento
web. Criar uma tela nova é tão simples quanto criar um arquivo
`.tsx` dentro da pasta `src/app/`.

**TypeScript**
Adotado para garantir segurança de tipos em todo o projeto,
especialmente nas interfaces de dados dos jogadores e nas props
dos componentes. Erros que seriam descobertos apenas em tempo de
execução são pegos em tempo de desenvolvimento.

**AsyncStorage**
Solução oficial e mais simples para persistência local no React
Native. Para o escopo do projeto (lista de jogadores), um banco
de dados completo como SQLite seria excessivo. O AsyncStorage
resolve com uma API mínima de get/set sem nenhuma configuração.

**EAS Build (Expo Application Services)**
Permite gerar o APK para Android sem instalar o Android Studio ou
configurar o SDK do Android localmente. O build é feito na nuvem
nos servidores da Expo, e o arquivo final é disponibilizado via
link para download — essencial para um projeto acadêmico onde
nem todos da equipe têm o ambiente Android configurado.

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js 18 ou superior
- npm ou yarn
- App **Expo Go** instalado no celular
  - [Android — Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
  - [iOS — App Store](https://apps.apple.com/app/expo-go/id982107779)

### Passo a passo

**1. Clone o repositório**
```bash
git clone https://github.com/seu-usuario/bora-rachar.git
cd "Bora Rachar/appweb"
```

**2. Instale as dependências**
```bash
npm install
```

**3. Inicie o servidor de desenvolvimento**
```bash
npx expo start
```

**4. Abra no celular**
Escaneie o QR code exibido no terminal com o app Expo Go.

> Para abrir no navegador, pressione `w` no terminal.

---

## 📦 Como Gerar o APK (Android)

### Pré-requisitos
- Conta gratuita em [expo.dev](https://expo.dev)
- EAS CLI instalado globalmente

```bash
npm install -g eas-cli
```

### Passo a passo

**1. Faça login na conta Expo**
```bash
eas login
```

**2. Configure o projeto (apenas na primeira vez)**
```bash
eas build:configure
```

**3. Gere o APK**
```bash
eas build -p android --profile preview
```

Aguarde 10–15 minutos. Ao finalizar, um link para download do
`.apk` será exibido no terminal e também ficará disponível em
[expo.dev/builds](https://expo.dev/builds).

**4. Instale no celular**
Transfira o `.apk` para o celular e instale.
> Pode ser necessário habilitar **"Instalar apps de fontes desconhecidas"**
> nas configurações do Android.

---

## 🌐 Deploy Web (Vercel)

O app também pode ser acessado via navegador após deploy no Vercel.

```bash
npx vercel --prod
```

> Certifique-se de cadastrar as variáveis de ambiente do Firebase
> em **Settings → Environment Variables** no painel da Vercel.

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` dentro da pasta `appweb/` com as seguintes
variáveis (obtidas no console do Firebase):

```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

> O arquivo `.env` está no `.gitignore` e **não deve ser commitado**.

---

## 📋 Considerações Finais

O Bora Rachar nasceu de uma necessidade real: organizar rachões de
futebol de forma justa e prática, sem depender de internet ou de
planilhas manuais. O projeto foi desenvolvido em etapas iterativas,
priorizando a experiência do usuário mobile e a clareza do código.

**O que foi entregue:**
- ✅ CRUD completo de jogadores com persistência local
- ✅ Algoritmo de sorteio equilibrado (Snake Draft)
- ✅ Tratamento de número quebrado de jogadores (linha/reserva)
- ✅ Cronômetro e placar em tempo real
- ✅ Design system consistente com identidade visual própria
- ✅ Transições animadas entre telas
- ✅ APK gerado e funcional para Android
- ✅ Deploy web via Vercel

**Possíveis evoluções futuras:**
- 🔲 Histórico de partidas e estatísticas por jogador
- 🔲 Compartilhamento dos times sorteados via WhatsApp
- 🔲 Modo torneio com chaveamento automático
- 🔲 Foto de perfil para cada jogador
- 🔲 Sincronização entre dispositivos via Firebase

---

## 📄 Licença

Projeto acadêmico desenvolvido para a disciplina de
Desenvolvimento Mobile — uso educacional.