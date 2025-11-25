// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão com o Supabase usando variáveis de ambiente
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Rota de teste (pra ver se o backend está vivo)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Índia App Backend funcionando!' });
});

// (Opcional por enquanto) Exemplo de rota de tarefas
app.get('/api/tasks', async (req, res) => {
  try {
    const userId = req.headers['x-user-id']; // depois melhoramos isso

    if (!userId) {
      return res.status(400).json({ error: 'User ID não informado' });
    }

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error('Erro ao buscar tasks:', err.message);
    res.status(500).json({ error: 'Erro ao buscar tasks' });
  }
});

// Porta
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Índia App Backend rodando na porta ${PORT}`);
});
