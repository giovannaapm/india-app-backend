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
// LESSONS
// -------------------------

// GET /api/lessons
app.get('/api/lessons', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(400).json({ error: 'User ID não informado' });
    }

    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('user_id', userId)
      .order('curso_id', { ascending: true })
      .order('ordem', { ascending: true });

    if (error) {
      console.error('Supabase error (GET /lessons):', error);
      return res.status(500).json({ error: 'Erro ao buscar aulas', details: error.message || error });
    }

    res.json(data);
  } catch (err) {
    console.error('Erro ao buscar aulas (exception):', err);
    res.status(500).json({ error: 'Erro ao buscar aulas', details: err.message || String(err) });
  }
});

// POST /api/lessons
app.post('/api/lessons', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(400).json({ error: 'User ID não informado' });
    }

    const {
      curso_id,
      titulo,
      descricao,
      status,
      ordem,
      duracao_estimada_minutos
    } = req.body || {};

    if (!curso_id || !titulo || !ordem) {
      return res.status(400).json({ error: 'curso_id, titulo e ordem são obrigatórios' });
    }

    const now = Date.now();

    const { data, error } = await supabase
      .from('lessons')
      .insert([{
        id: randomUUID(),
        user_id: userId,
        curso_id,
        titulo,
        descricao: descricao || null,
        status: status || null,
        ordem,
        duracao_estimada_minutos: duracao_estimada_minutos || null,
        created_at: now,
        updated_at: now
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error (POST /lessons):', error);
      return res.status(500).json({ error: 'Erro ao criar aula', details: error.message || error });
    }

    res.status(201).json(data);
  } catch (err) {
    console.error('Erro ao criar aula (exception):', err);
    res.status(500).json({ error: 'Erro ao criar aula', details: err.message || String(err) });
  }
});

// PUT /api/lessons/:id
app.put('/api/lessons/:id', async (req, res) => {
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
      .from('lessons')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error (PUT /lessons/:id):', error);
      return res.status(500).json({ error: 'Erro ao atualizar aula', details: error.message || error });
    }

    res.json(data);
  } catch (err) {
    console.error('Erro ao atualizar aula (exception):', err);
    res.status(500).json({ error: 'Erro ao atualizar aula', details: err.message || String(err) });
  }
});

// DELETE /api/lessons/:id
app.delete('/api/lessons/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { id } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID não informado' });
    }

    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Supabase error (DELETE /lessons/:id):', error);
      return res.status(500).json({ error: 'Erro ao excluir aula', details: error.message || error });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Erro ao excluir aula (exception):', err);
    res.status(500).json({ error: 'Erro ao excluir aula', details: err.message || String(err) });
  }
});

// -------------------------
// BOOKS
// -------------------------

// GET /api/books
app.get('/api/books', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(400).json({ error: 'User ID não informado' });
    }

    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Supabase error (GET /books):', error);
      return res
        .status(500)
        .json({ error: 'Erro ao buscar livros', details: error.message || error });
    }

    res.json(data);
  } catch (err) {
    console.error('Erro ao buscar livros (exception):', err);
    res
      .status(500)
      .json({ error: 'Erro ao buscar livros', details: err.message || String(err) });
  }
});

// POST /api/books
app.post('/api/books', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(400).json({ error: 'User ID não informado' });
    }

    const {
      titulo,
      autor,
      cover,
      categoria,
      status,
      formato,
      total_paginas,
      pagina_atual,
      data_inicio,
      data_conclusao,
      notas_gerais
    } = req.body || {};

    if (!titulo) {
      return res.status(400).json({ error: 'O campo titulo é obrigatório' });
    }

    const now = Date.now();

    const { data, error } = await supabase
      .from('books')
      .insert([
        {
          id: randomUUID(),
          user_id: userId,
          titulo: titulo || null,
          autor: autor || null,
          cover: cover || null,
          categoria: categoria || null,
          status: status || null,
          formato: formato || null,
          total_paginas: total_paginas || null,
          pagina_atual: pagina_atual || null,
          data_inicio: data_inicio || null,
          data_conclusao: data_conclusao || null,
          notas_gerais: notas_gerais || null,
          created_at: now,
          updated_at: now
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error (POST /books):', error);
      return res
        .status(500)
        .json({ error: 'Erro ao criar livro', details: error.message || error });
    }

    res.status(201).json(data);
  } catch (err) {
    console.error('Erro ao criar livro (exception):', err);
    res
      .status(500)
      .json({ error: 'Erro ao criar livro', details: err.message || String(err) });
  }
});

// PUT /api/books/:id
app.put('/api/books/:id', async (req, res) => {
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
      .from('books')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error (PUT /books/:id):', error);
      return res
        .status(500)
        .json({ error: 'Erro ao atualizar livro', details: error.message || error });
    }

    res.json(data);
  } catch (err) {
    console.error('Erro ao atualizar livro (exception):', err);
    res
      .status(500)
      .json({ error: 'Erro ao atualizar livro', details: err.message || String(err) });
  }
});

// DELETE /api/books/:id
app.delete('/api/books/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { id } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID não informado' });
    }

    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Supabase error (DELETE /books/:id):', error);
      return res
        .status(500)
        .json({ error: 'Erro ao excluir livro', details: error.message || error });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Erro ao excluir livro (exception):', err);
    res
      .status(500)
      .json({ error: 'Erro ao excluir livro', details: err.message || String(err) });
  }
});
// -------------------------
// NOTES
// -------------------------

// GET /api/notes
app.get('/api/notes', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(400).json({ error: 'User ID não informado' });
    }

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error (GET /notes):', error);
      return res
        .status(500)
        .json({ error: 'Erro ao buscar notas', details: error.message || error });
    }

    res.json(data);
  } catch (err) {
    console.error('Erro ao buscar notas (exception):', err);
    res
      .status(500)
      .json({ error: 'Erro ao buscar notas', details: err.message || String(err) });
  }
});

// POST /api/notes
app.post('/api/notes', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(400).json({ error: 'User ID não informado' });
    }

    const {
      tipo_entidade,
      entidade_id,
      titulo,
      conteudo,
    } = req.body || {};

    if (!tipo_entidade || !entidade_id || !titulo || !conteudo) {
      return res.status(400).json({ error: 'Campos obrigatórios: tipo_entidade, entidade_id, titulo, conteudo' });
    }

    const now = Date.now();

    const { data, error } = await supabase
      .from('notes')
      .insert([
        {
          id: randomUUID(),
          user_id: userId,
          tipo_entidade,
          entidade_id,
          titulo,
          conteudo,
          created_at: now,
          updated_at: now,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error (POST /notes):', error);
      return res
        .status(500)
        .json({ error: 'Erro ao criar nota', details: error.message || error });
    }

    res.status(201).json(data);
  } catch (err) {
    console.error('Erro ao criar nota (exception):', err);
    res
      .status(500)
      .json({ error: 'Erro ao criar nota', details: err.message || String(err) });
  }
});

// PUT /api/notes/:id
app.put('/api/notes/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { id } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID não informado' });
    }

    if (!id) {
      return res.status(400).json({ error: 'Note id é obrigatório' });
    }

    const updates = {
      ...req.body,
      updated_at: Date.now(),
    };

    delete updates.id;
    delete updates.user_id;
    delete updates.created_at;

    const { data, error } = await supabase
      .from('notes')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error (PUT /notes/:id):', error);
      return res
        .status(500)
        .json({ error: 'Erro ao atualizar nota', details: error.message || error });
    }

    if (!data) {
      return res.status(404).json({ error: 'Nota não encontrada' });
    }

    res.json(data);
  } catch (err) {
    console.error('Erro ao atualizar nota (exception):', err);
    res
      .status(500)
      .json({ error: 'Erro ao atualizar nota', details: err.message || String(err) });
  }
});

// DELETE /api/notes/:id
app.delete('/api/notes/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { id } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID não informado' });
    }

    if (!id) {
      return res.status(400).json({ error: 'Note id é obrigatório' });
    }

    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Supabase error (DELETE /notes/:id):', error);
      return res
        .status(500)
        .json({ error: 'Erro ao excluir nota', details: error.message || error });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Erro ao excluir nota (exception):', err);
    res
      .status(500)
      .json({ error: 'Erro ao excluir nota', details: err.message || String(err) });
  }
});
// -------------------------
// HABITS
// -------------------------

// GET /api/habits
app.get('/api/habits', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(400).json({ error: 'User ID não informado' });
    }

    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error (GET /habits):', error);
      return res.status(500).json({
        error: 'Erro ao buscar hábitos',
        details: error.message || error,
      });
    }

    res.json(data);
  } catch (err) {
    console.error('Erro ao buscar hábitos (exception):', err);
    res.status(500).json({
      error: 'Erro ao buscar hábitos',
      details: err.message || String(err),
    });
  }
});

// POST /api/habits
app.post('/api/habits', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(400).json({ error: 'User ID não informado' });
    }

    const {
      nome,
      descricao,
      area,
      tipo_recorrencia,
      config_frequencia,
      meta_diaria,
      unidade,
      ativo,
      data_inicio,
      streak_atual,
      melhor_streak,
    } = req.body || {};

    if (!nome) {
      return res.status(400).json({ error: 'O campo nome é obrigatório' });
    }

    const now = Date.now();

    const { data, error } = await supabase
      .from('habits')
      .insert([
        {
          id: randomUUID(),
          user_id: userId,
          nome,
          descricao: descricao || null,
          area: area || null,
          tipo_recorrencia: tipo_recorrencia || null,
          config_frequencia: config_frequencia || null,
          meta_diaria: meta_diaria ?? null,
          unidade: unidade || null,
          ativo: typeof ativo === 'boolean' ? ativo : true,
          data_inicio: data_inicio || null,
          streak_atual: streak_atual ?? 0,
          melhor_streak: melhor_streak ?? 0,
          created_at: now,
          updated_at: now,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error (POST /habits):', error);
      return res.status(500).json({
        error: 'Erro ao criar hábito',
        details: error.message || error,
      });
    }

    res.status(201).json(data);
  } catch (err) {
    console.error('Erro ao criar hábito (exception):', err);
    res.status(500).json({
      error: 'Erro ao criar hábito',
      details: err.message || String(err),
    });
  }
});

// PUT /api/habits/:id
app.put('/api/habits/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { id } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID não informado' });
    }

    const updates = {
      ...req.body,
      updated_at: Date.now(),
    };

    // Campos que não devem ser atualizados diretamente
    delete updates.id;
    delete updates.user_id;
    delete updates.created_at;

    const { data, error } = await supabase
      .from('habits')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error (PUT /habits/:id):', error);
      return res.status(500).json({
        error: 'Erro ao atualizar hábito',
        details: error.message || error,
      });
    }

    res.json(data);
  } catch (err) {
    console.error('Erro ao atualizar hábito (exception):', err);
    res.status(500).json({
      error: 'Erro ao atualizar hábito',
      details: err.message || String(err),
    });
  }
});

// DELETE /api/habits/:id
app.delete('/api/habits/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { id } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID não informado' });
    }

    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Supabase error (DELETE /habits/:id):', error);
      return res.status(500).json({
        error: 'Erro ao excluir hábito',
        details: error.message || error,
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Erro ao excluir hábito (exception):', err);
    res.status(500).json({
      error: 'Erro ao excluir hábito',
      details: err.message || String(err),
    });
  }
});
// -------------------------
// HABIT LOGS
// -------------------------

// GET /api/habit-logs
app.get('/api/habit-logs', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const habitId = req.query.habit_id;

    if (!userId) {
      return res.status(400).json({ error: 'User ID não informado' });
    }

    let query = supabase
      .from('habit_logs')
      .select('*')
      .eq('user_id', userId)
      .order('data', { ascending: false });

    if (habitId) {
      query = query.eq('habito_id', habitId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error (GET /habit-logs):', error);
      return res.status(500).json({
        error: 'Erro ao buscar logs de hábitos',
        details: error.message || error,
      });
    }

    res.json(data);
  } catch (err) {
    console.error('Erro ao buscar logs de hábitos (exception):', err);
    res.status(500).json({
      error: 'Erro ao buscar logs de hábitos',
      details: err.message || String(err),
    });
  }
});

// POST /api/habit-logs
app.post('/api/habit-logs', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(400).json({ error: 'User ID não informado' });
    }

    const { habito_id, data, valor_realizado } = req.body || {};

    if (!habito_id) {
      return res
        .status(400)
        .json({ error: 'O campo habito_id é obrigatório' });
    }

    const todayIso = new Date().toISOString().split('T')[0];
    const logDate = data || todayIso;
    const now = Date.now();

    const { data: created, error } = await supabase
      .from('habit_logs')
      .insert([
        {
          id: randomUUID(),
          user_id: userId,
          habito_id,
          data: logDate,
          valor_realizado: valor_realizado ?? 1,
          created_at: now,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error (POST /habit-logs):', error);
      return res.status(500).json({
        error: 'Erro ao criar log de hábito',
        details: error.message || error,
      });
    }

    res.status(201).json(created);
  } catch (err) {
    console.error('Erro ao criar log de hábito (exception):', err);
    res.status(500).json({
      error: 'Erro ao criar log de hábito',
      details: err.message || String(err),
    });
  }
});

// DELETE /api/habit-logs/:id
app.delete('/api/habit-logs/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { id } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID não informado' });
    }

    const { error } = await supabase
      .from('habit_logs')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Supabase error (DELETE /habit-logs/:id):', error);
      return res.status(500).json({
        error: 'Erro ao excluir log de hábito',
        details: error.message || error,
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Erro ao excluir log de hábito (exception):', err);
    res.status(500).json({
      error: 'Erro ao excluir log de hábito',
      details: err.message || String(err),
    });
  }
});
// -------------------------
// GOALS
// -------------------------

// GET /api/goals
app.get('/api/goals', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(400).json({ error: 'User ID não informado' });
    }

    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error (GET /goals):', error);
      return res.status(500).json({
        error: 'Erro ao buscar metas',
        details: error.message || error,
      });
    }

    res.json(data);
  } catch (err) {
    console.error('Erro ao buscar metas (exception):', err);
    res.status(500).json({
      error: 'Erro ao buscar metas',
      details: err.message || String(err),
    });
  }
});

// POST /api/goals
app.post('/api/goals', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(400).json({ error: 'User ID não informado' });
    }

    const {
      nome,
      descricao,
      area,
      categoria,
      tipo_meta,
      status,
      unidade,
      valor_meta,
      valor_atual,
      frequencia,
      data_inicio,
      prazo,
      data_conclusao,
      projeto_relacionado_id,
    } = req.body || {};

    if (!nome) {
      return res.status(400).json({ error: 'O campo nome é obrigatório' });
    }

    const now = Date.now();

    const { data, error } = await supabase
      .from('goals')
      .insert([
        {
          id: randomUUID(),
          user_id: userId,
          nome,
          descricao: descricao || null,
          area: area || null,
          categoria: categoria || null,
          tipo_meta: tipo_meta || null,
          status: status || 'IN_PROGRESS',
          unidade: unidade || null,
          valor_meta: valor_meta ?? null,
          valor_atual: valor_atual ?? 0,
          frequencia: frequencia || null,
          data_inicio: data_inicio || null,
          prazo: prazo || null,
          data_conclusao: data_conclusao || null,
          projeto_relacionado_id: projeto_relacionado_id || null,
          created_at: now,
          updated_at: now,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error (POST /goals):', error);
      return res.status(500).json({
        error: 'Erro ao criar meta',
        details: error.message || error,
      });
    }

    res.status(201).json(data);
  } catch (err) {
    console.error('Erro ao criar meta (exception):', err);
    res.status(500).json({
      error: 'Erro ao criar meta',
      details: err.message || String(err),
    });
  }
});

// PUT /api/goals/:id
app.put('/api/goals/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { id } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID não informado' });
    }

    const updates = {
      ...req.body,
      updated_at: Date.now(),
    };

    delete updates.id;
    delete updates.user_id;
    delete updates.created_at;

    const { data, error } = await supabase
      .from('goals')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error (PUT /goals/:id):', error);
      return res.status(500).json({
        error: 'Erro ao atualizar meta',
        details: error.message || error,
      });
    }

    res.json(data);
  } catch (err) {
    console.error('Erro ao atualizar meta (exception):', err);
    res.status(500).json({
      error: 'Erro ao atualizar meta',
      details: err.message || String(err),
    });
  }
});

// DELETE /api/goals/:id
app.delete('/api/goals/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { id } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID não informado' });
    }

    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Supabase error (DELETE /goals/:id):', error);
      return res.status(500).json({
        error: 'Erro ao excluir meta',
        details: error.message || error,
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Erro ao excluir meta (exception):', err);
    res.status(500).json({
      error: 'Erro ao excluir meta',
      details: err.message || String(err),
    });
  }
});

// -------------------------
// PORTA
// -------------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Índia App Backend rodando na porta ${PORT}`);
});
