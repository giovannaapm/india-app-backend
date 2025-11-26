// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const { randomUUID } = require('crypto');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão com o Supabase usando variáveis de ambiente
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// -------------------------
// ROTA DE TESTE
// -------------------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Índia App Backend funcionando!' });
});

// -------------------------
// GET /api/tasks
// -------------------------
app.get('/api/tasks', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];

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

// -------------------------
// POST /api/tasks
// -------------------------
app.post('/api/tasks', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(400).json({ error: 'User ID não informado' });
    }

    const {
      titulo,
      descricao,
      area,
      subarea_profissional,
      categoria,
      projeto_id,
      curso_id,
      livro_id,
      status,
      prioridade,
      data_vencimento,
      hora_vencimento,
      estimativa_minutos,
      tipo_recorrencia,
      dia_recorrencia_original,
      observacoes,
      subtasks
    } = req.body;

    if (!titulo) {
      return res.status(400).json({ error: 'O campo titulo é obrigatório' });
    }

    const now = Date.now();

    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        id: randomUUID(),
        user_id: userId,
        titulo: titulo || null,
        descricao: descricao || null,
        area: area || null,
        subarea_profissional: subarea_profissional || null,
        categoria: categoria || null,
        projeto_id: projeto_id || null,
        curso_id: curso_id || null,
        livro_id: livro_id || null,
        status: status || 'PENDENTE',
        prioridade: prioridade || null,
        data_vencimento: data_vencimento || null,
        hora_vencimento: hora_vencimento || null,
        estimativa_minutos: estimativa_minutos || null,
        tipo_recorrencia: tipo_recorrencia || null,
        dia_recorrencia_original: dia_recorrencia_original || null,
        observacoes: observacoes || null,
        subtasks: subtasks || null,
        created_at: now,
        updated_at: now
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    console.error('Erro ao criar task:', err.message);
    res.status(500).json({ error: 'Erro ao criar task' });
  }
});
// Atualizar tarefa
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const taskId = req.params.id;
    const updates = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID não informado' });
    }

    const { data, error } = await supabase
      .from('tasks')
      .update({
        ...updates,
        updated_at: Date.now()
      })
      .eq('id', taskId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error('Erro ao atualizar task:', err.message);
    res.status(500).json({ error: 'Erro ao atualizar task' });
  }
});
// Deletar tarefa
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const taskId = req.params.id;

    if (!userId) {
      return res.status(400).json({ error: 'User ID não informado' });
    }

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .eq('user_id', userId);

    if (error) throw error;

    res.json({ success: true });
  } catch (err) {
    console.error('Erro ao deletar task:', err.message);
    res.status(500).json({ error: 'Erro ao deletar task' });
  }
});

// -------------------------
// PORTA
// -------------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Índia App Backend rodando na porta ${PORT}`);
});

