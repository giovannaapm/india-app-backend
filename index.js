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
// TASKS
// -------------------------

// GET /api/tasks
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

    if (error) {
      console.error('Supabase error (GET /tasks):', error);
      return res.status(500).json({ error: 'Erro ao buscar tasks', details: error.message || error });
    }

    res.json(data);
  } catch (err) {
    console.error('Erro ao buscar tasks (exception):', err);
    res.status(500).json({ error: 'Erro ao buscar tasks', details: err.message || String(err) });
  }
});

// POST /api/tasks
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
    } = req.body || {};

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

    if (error) {
      console.error('Supabase error (POST /tasks):', error);
      return res.status(500).json({ error: 'Erro ao criar task', details: error.message || error });
    }

    res.status(201).json(data);
  } catch (err) {
    console.error('Erro ao criar task (exception):', err);
    res.status(500).json({ error: 'Erro ao criar task', details: err.message || String(err) });
  }
});

// PUT /api/tasks/:id
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { id } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID não informado' });
    }

    const updates = {
      ...req.body,
      updated_at: Date.now()
    };

    // Nunca atualizar esses campos diretamente
    delete updates.id;
    delete updates.user_id;
    delete updates.created_at;

    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error (PUT /tasks/:id):', error);
      return res.status(500).json({ error: 'Erro ao atualizar task', details: error.message || error });
    }

    res.json(data);
  } catch (err) {
    console.error('Erro ao atualizar task (exception):', err);
    res.status(500).json({ error: 'Erro ao atualizar task', details: err.message || String(err) });
  }
});

// DELETE /api/tasks/:id
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { id } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID não informado' });
    }

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Supabase error (DELETE /tasks/:id):', error);
      return res.status(500).json({ error: 'Erro ao excluir task', details: error.message || error });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Erro ao excluir task (exception):', err);
    res.status(500).json({ error: 'Erro ao excluir task', details: err.message || String(err) });
  }
});

// -------------------------
// PROJECTS
// -------------------------

// GET /api/projects
app.get('/api/projects', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(400).json({ error: 'User ID não informado' });
    }

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error (GET /projects):', error);
      return res.status(500).json({ error: 'Erro ao buscar projetos', details: error.message || error });
    }

    res.json(data);
  } catch (err) {
    console.error('Erro ao buscar projetos (exception):', err);
    res.status(500).json({ error: 'Erro ao buscar projetos', details: err.message || String(err) });
  }
});

// POST /api/projects
app.post('/api/projects', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(400).json({ error: 'User ID não informado' });
    }

    const {
      nome,
      area,
      subarea_profissional,
      categoria,
      tipo,
      objetivo,
      descricao,
      status,
      data_inicio,
      data_fim_prevista,
      metrica_sucesso,
      checklist,
      checklists
    } = req.body || {};

    if (!nome || !area) {
      return res.status(400).json({ error: 'Nome e área são obrigatórios' });
    }

    const now = Date.now();

    const { data, error } = await supabase
      .from('projects')
      .insert([{
        id: randomUUID(),
        user_id: userId,
        nome,
        area,
        subarea_profissional: subarea_profissional || null,
        categoria: categoria || null,
        tipo: tipo || null,
        objetivo: objetivo || null,
        descricao: descricao || null,
        status: status || null,
        data_inicio: data_inicio || null,
        data_fim_prevista: data_fim_prevista || null,
        metrica_sucesso: metrica_sucesso || null,
        checklist: checklist || null,
        checklists: checklists || null,
        created_at: now,
        updated_at: now
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error (POST /projects):', error);
      return res.status(500).json({
        error: 'Erro ao criar projeto',
        details: error.message || error
      });
    }

    res.json(data);
  } catch (err) {
    console.error('Erro ao criar projeto (exception):', err);
    res.status(500).json({
      error: 'Erro ao criar projeto',
      details: err.message || String(err)
    });
  }
});

// PUT /api/projects/:id
app.put('/api/projects/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { id } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID não informado' });
    }

    const updates = {
      ...req.body,
      updated_at: Date.now()
    };

    delete updates.id;
    delete updates.user_id;
    delete updates.created_at;

    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error (PUT /projects/:id):', error);
      return res.status(500).json({ error: 'Erro ao atualizar projeto', details: error.message || error });
    }

    res.json(data);
  } catch (err) {
    console.error('Erro ao atualizar projeto (exception):', err);
    res.status(500).json({ error: 'Erro ao atualizar projeto', details: err.message || String(err) });
  }
});

// DELETE /api/projects/:id
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { id } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID não informado' });
    }

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Supabase error (DELETE /projects/:id):', error);
      return res.status(500).json({ error: 'Erro ao excluir projeto', details: error.message || error });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Erro ao excluir projeto (exception):', err);
    res.status(500).json({ error: 'Erro ao excluir projeto', details: err.message || String(err) });
  }
});
// -------------------------
// COURSES
// -------------------------

// GET /api/courses
app.get('/api/courses', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(400).json({ error: 'User ID não informado' });
    }

    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Supabase error (GET /courses):', error);
      return res.status(500).json({ error: 'Erro ao buscar cursos', details: error.message || error });
    }

    res.json(data);
  } catch (err) {
    console.error('Erro ao buscar cursos (exception):', err);
    res.status(500).json({ error: 'Erro ao buscar cursos', details: err.message || String(err) });
  }
});
// POST /api/courses
app.post('/api/courses', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(400).json({ error: 'User ID não informado' });
    }

    const {
      nome,
      plataforma,
      area,
      tipo,
      status,
      descricao,
      link,
      carga_horaria_total
    } = req.body || {};

    if (!nome || !plataforma) {
      return res.status(400).json({ error: 'Nome e plataforma são obrigatórios' });
    }

    const now = Date.now();

    const { data, error } = await supabase
      .from('courses')
      .insert([{
        id: randomUUID(),
        user_id: userId,
        nome,
        plataforma,
        area: area || null,
        tipo: tipo || null,
        status: status || null,
        descricao: descricao || null,
        link: link || null,
        carga_horaria_total: carga_horaria_total || null,
        created_at: now,
        updated_at: now
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error (POST /courses):', error);
      return res.status(500).json({ error: 'Erro ao criar curso', details: error.message || error });
    }

    res.status(201).json(data);
  } catch (err) {
    console.error('Erro ao criar curso (exception):', err);
    res.status(500).json({ error: 'Erro ao criar curso', details: err.message || String(err) });
  }
});
// PUT /api/courses/:id
app.put('/api/courses/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { id } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID não informado' });
    }

    const updates = {
      ...req.body,
      updated_at: Date.now()
    };

    // Nunca atualiza esses campos
    delete updates.id;
    delete updates.user_id;
    delete updates.created_at;

    const { data, error } = await supabase
      .from('courses')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error (PUT /courses/:id):', error);
      return res.status(500).json({ error: 'Erro ao atualizar curso', details: error.message || error });
    }

    res.json(data);
  } catch (err) {
    console.error('Erro ao atualizar curso (exception):', err);
    res.status(500).json({ error: 'Erro ao atualizar curso', details: err.message || String(err) });
  }
});
// DELETE /api/courses/:id
app.delete('/api/courses/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { id } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID não informado' });
    }

    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Supabase error (DELETE /courses/:id):', error);
      return res.status(500).json({ error: 'Erro ao excluir curso', details: error.message || error });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Erro ao excluir curso (exception):', err);
    res.status(500).json({ error: 'Erro ao excluir curso', details: err.message || String(err) });
  }
});

// -------------------------
// PORTA
// -------------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Índia App Backend rodando na porta ${PORT}`);
});
