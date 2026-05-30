CREATE TABLE jogador (
    id_jogador SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,

    nota INT NOT NULL CHECK(nota >= 1 AND nota <= 5),
    posicao VARCHAR(20) NOT NULL CHECK (posicao IN ('ataque', 'meio Campo', 'Defesa', 'goleiro', 'Volante')),

    ativo BOOLEAN DEFAULT TRUE
);
-- Tabale do jogador feita.

CREATE TABLE sorteio (
    id_sorteio SERIAL PRIMARY KEY,

    data_criação TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    quantidade_times INT NOT NULL
);
-- Tabela do sorteio feita.

CREATE TABLE time (
    id_time SERIAL PRIMARY KEY,
    id_sorteio INT REFERENCES sorteio(id_sorteio) ON DELETE CASCADE,
    nome_time VARCHAR(50) NOT NULL,

    media_estrelas DECIMAL(3,2)
);
-- Tabela do time feita.

CREATE TABLE time_jogador (
    id_time INT REFERENCES time(id_time) ON DELETE CASCADE,
    id_jogador INT REFERENCES jogador(id_jogador) ON DELETE CASCADE
    PRIMARY KEY (id_time, id_jogador)
);

CREATE TABLE FilaDeEspera (
    id_fila SERIAL PRIMARY KEY,
    id_sorteio INT REFERENCES sorteio(id_sorteio) ON DELETE CASCADE,
    ID_jogador INT REFERENCES jogador(id_jogador) ON DELETE CASCADE,

    ordem_entrada INT NOT NULL
)
-- Tabela da fila de espera feita.