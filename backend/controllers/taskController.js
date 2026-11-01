const crypto = require('node:crypto');
const db = require('../config/db');
// The application currently has a single active profile until authentication is added.
const CURRENT_USER_ID = 'USR-1';

async function resolveProjectId(connection, task) {
  if (task.project_id) return task.project_id;
  const [projects] = await connection.query('SELECT id FROM projects WHERE name = ? LIMIT 1', [task.project]);
  return projects[0]?.id || null;
}

async function resolveAssigneeId(connection, assignee) {
  if (!assignee) return null;
  const [users] = await connection.query('SELECT id FROM users WHERE id = ? OR name = ? LIMIT 1', [assignee, assignee]);
  return users[0]?.id || null;
}

async function replaceTaskDetails(connection, taskId, task) {
  if (Array.isArray(task.subtasks)) {
    await connection.query('DELETE FROM subtasks WHERE task_id = ?', [taskId]);
    for (const subtask of task.subtasks) {
      await connection.query(
        'INSERT INTO subtasks (id, task_id, title, completed) VALUES (?, ?, ?, ?)',
        [`SUB-${crypto.randomUUID()}`, taskId, subtask.title, Boolean(subtask.completed)]
      );
    }
  }
  if (Array.isArray(task.dependencies)) {
    await connection.query('DELETE FROM task_dependencies WHERE task_id = ?', [taskId]);
    for (const dependencyId of task.dependencies) {
      await connection.query(
        'INSERT INTO task_dependencies (task_id, depends_on_task_id) VALUES (?, ?)',
        [taskId, dependencyId]
      );
    }
  }
  if (Array.isArray(task.comments)) {
    await connection.query('DELETE FROM task_comments WHERE task_id = ?', [taskId]);
    for (const comment of task.comments) {
      const [authors] = await connection.query(
        'SELECT id FROM users WHERE id = ? OR name = ? LIMIT 1',
        [comment.author, comment.author]
      );
      await connection.query(
        'INSERT INTO task_comments (id, task_id, author_id, text, created_at) VALUES (?, ?, ?, ?, ?)',
        [`CMT-${crypto.randomUUID()}`, taskId, authors[0]?.id || 'USR-1', comment.text,
          comment.timestamp ? new Date(comment.timestamp) : new Date()]
      );
    }
  }
}

function isManagerRole(role) {
  const normalizedRole = String(role || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

  return normalizedRole === 'manager';
}

exports.getAllTasks = async (req, res) => {
  try {
    const [tasks] = await db.query(`
      SELECT t.id, t.title, t.description, p.name AS project, u.name AS assignee,
             t.status, t.priority, t.due_date AS dueDate, t.sprint_id AS sprintId
      FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN users u ON t.assignee_id = u.id
      ORDER BY t.created_at DESC
    `);
    for (const task of tasks) {
      const [subtasks] = await db.query(
        'SELECT id, title, completed FROM subtasks WHERE task_id = ? ORDER BY created_at ASC',
        [task.id]
      );
      const [dependencies] = await db.query(
        'SELECT depends_on_task_id FROM task_dependencies WHERE task_id = ?',
        [task.id]
      );
      const [comments] = await db.query(`
        SELECT c.id, u.name AS author, c.text, c.created_at AS timestamp
        FROM task_comments c JOIN users u ON c.author_id = u.id
        WHERE c.task_id = ? ORDER BY c.created_at ASC
      `, [task.id]);
      task.subtasks = subtasks;
      task.dependencies = dependencies.map(item => item.depends_on_task_id);
      task.comments = comments;
    }
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des tâches', details: err.message });
  }
};

exports.createTask = async (req, res) => {
  const connection = await db.getConnection();
  const task = req.body;
  const id = task.id || `TSK-${crypto.randomUUID()}`;
  try {
    await connection.beginTransaction();
    const projectId = await resolveProjectId(connection, task);
    if (!projectId) {
      await connection.rollback();
      return res.status(400).json({ error: 'Le projet associé à la tâche est introuvable' });
    }
    const assigneeId = await resolveAssigneeId(connection, task.assignee_id || task.assignee);
    await connection.query(
      `INSERT INTO tasks
        (id, title, description, project_id, assignee_id, status, priority, due_date, sprint_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, task.title, task.description || '', projectId, assigneeId, task.status || 'todo',
        task.priority || 'medium', task.dueDate || task.due_date, task.sprintId || task.sprint_id || null]
    );
    await replaceTaskDetails(connection, id, task);
    await connection.commit();
    res.status(201).json({ message: 'Tâche créée avec succès', taskId: id });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: 'Erreur lors de la création de la tâche', details: err.message });
  } finally {
    connection.release();
  }
};

exports.updateTask = async (req, res) => {
  const connection = await db.getConnection();
  const { id } = req.params;
  const task = req.body;
  try {
    await connection.beginTransaction();
    const [existingTasks] = await connection.query(
      'SELECT status FROM tasks WHERE id = ? FOR UPDATE',
      [id]
    );
    if (existingTasks.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }
    if (existingTasks[0].status === 'review' && task.status === 'done') {
      const [actors] = await connection.query('SELECT role FROM users WHERE id = ?', [CURRENT_USER_ID]);
      if (!actors.length || !isManagerRole(actors[0].role)) {
        await connection.rollback();
        return res.status(403).json({ error: 'Seul un manager peut terminer une tâche en revue' });
      }
    }
    const projectId = await resolveProjectId(connection, task);
    const assigneeId = await resolveAssigneeId(connection, task.assignee_id || task.assignee);
    await connection.query(
      `UPDATE tasks SET
        title = COALESCE(?, title), description = COALESCE(?, description),
        project_id = COALESCE(?, project_id), assignee_id = ?,
        status = COALESCE(?, status), priority = COALESCE(?, priority),
        due_date = COALESCE(?, due_date), sprint_id = ?
       WHERE id = ?`,
      [task.title ?? null, task.description ?? null, projectId, assigneeId,
        task.status ?? null, task.priority ?? null, task.dueDate || task.due_date || null,
        task.sprintId ?? task.sprint_id ?? null, id]
    );
    await replaceTaskDetails(connection, id, task);
    await connection.commit();
    res.json({ message: 'Tâche mise à jour avec succès' });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la tâche', details: err.message });
  } finally {
    connection.release();
  }
};

exports.reassignTasksBulk = async (req, res) => {
  const { reassignments } = req.body;
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    if (Array.isArray(reassignments)) {
      for (const item of reassignments) {
        const assigneeId = await resolveAssigneeId(connection, item.newAssignee || item.targetAssigneeId);
        await connection.query('UPDATE tasks SET assignee_id = ? WHERE id = ?', [assigneeId, item.taskId]);
      }
    }
    await connection.commit();
    res.json({ message: 'Réassignation globale effectuée avec succès' });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: 'Erreur lors de la réassignation en masse', details: err.message });
  } finally {
    connection.release();
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await db.query('DELETE FROM tasks WHERE id = ?', [req.params.id]);
    res.json({ message: 'Tâche supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la tâche', details: err.message });
  }
};

exports.duplicateTask = async (req, res) => {
  const connection = await db.getConnection();
  const id = req.params.id;
  const newId = `TSK-${crypto.randomUUID()}`;
  try {
    await connection.beginTransaction();
    const [tasks] = await connection.query('SELECT * FROM tasks WHERE id = ?', [id]);
    if (tasks.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }
    const task = tasks[0];
    await connection.query(
      `INSERT INTO tasks (id, title, description, project_id, assignee_id, status, priority, due_date, sprint_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [newId, `${task.title} (Copie)`, task.description, task.project_id, task.assignee_id,
        task.status, task.priority, task.due_date, task.sprint_id]
    );
    const [subtasks] = await connection.query('SELECT title, completed FROM subtasks WHERE task_id = ?', [id]);
    for (const subtask of subtasks) {
      await connection.query(
        'INSERT INTO subtasks (id, task_id, title, completed) VALUES (?, ?, ?, ?)',
        [`SUB-${crypto.randomUUID()}`, newId, subtask.title, subtask.completed]
      );
    }
    const [dependencies] = await connection.query('SELECT depends_on_task_id FROM task_dependencies WHERE task_id = ?', [id]);
    for (const dependency of dependencies) {
      await connection.query('INSERT INTO task_dependencies (task_id, depends_on_task_id) VALUES (?, ?)', [newId, dependency.depends_on_task_id]);
    }
    await connection.commit();
    res.status(201).json({ message: 'Tâche dupliquée avec succès', taskId: newId });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: 'Erreur lors de la duplication', details: err.message });
  } finally {
    connection.release();
  }
};

exports.addComment = async (req, res) => {
  const id = `CMT-${crypto.randomUUID()}`;
  try {
    await db.query(
      'INSERT INTO task_comments (id, task_id, author_id, text) VALUES (?, ?, ?, ?)',
      [id, req.params.taskId, req.body.author_id || 'USR-1', req.body.text]
    );
    res.status(201).json({ message: 'Commentaire ajouté avec succès', commentId: id });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l’ajout du commentaire', details: err.message });
  }
};
