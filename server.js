/**********************************************
 * server.js
 **********************************************/

const express = require('express');
const cors = require('cors');
const { Client } = require('pg');

const app = express();
const port = 3000;

// Middleware para aceitar JSON e habilitar CORS
app.use(cors());
app.use(express.json());

// Configuração da conexão com o PostgreSQL
const client = new Client({
  host: 'aws-0-eu-central-1.pooler.supabase.com', // Ajuste para o seu host
  user: 'postgres.poyxgtqsxnnorpmttegh',          // Seu usuário
  password: 'torneiofifa2425',                   // Sua senha
  database: 'postgres',                          // Nome do seu banco
  port: 5432,                                    // Porta padrão do PostgreSQL
  connectionTimeoutMillis: 10000                 // Timeout de 10s
});

// Conectar ao banco de dados
client.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conectado ao banco de dados PostgreSQL!');
  }
});

// Rota para inserir dados na tabela "jogadores"
app.post('/add', async (req, res) => {
  // Verifica se a requisição está chegando corretamente
  console.log('Recebendo requisição /add com body:', req.body);

  // Desestrutura os campos do body
  const { nome, ncard, turma, ano, numtele } = req.body;

  // Query de inserção
  const sql = "INSERT INTO jogadores (nome, ncard, turma, ano, numtele) VALUES ($1, $2, $3, $4, $5) RETURNING *;";

  try {
    const result = await client.query(sql, [nome, ncard, turma, ano, numtele]);
    
    // Se o insert foi bem-sucedido, retorna a linha inserida
    console.log('Dados inseridos:', result.rows[0]);

    res.status(200).json({
      message: 'Dados inseridos com sucesso!',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao inserir dados:', error);
    res.status(500).json({ message: 'Erro ao inserir dados' });
  }
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
