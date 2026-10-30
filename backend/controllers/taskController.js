const db = require('../config/db');

// Récupérer toutes les tâches avec leurs sous-tâches, commentaires et dépendances
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

    for (let task of tasks) {
      // Sous-tâches
      const [subtasks] = await db.query('SELECT id, title, completed FROM subtasks WHERE task_id = ?', [task.id]);
      task.subtasks = subtasks;

      // Dépendances
      const [deps] = await db.query('SELECT depends_on_task_id FROM task_dependencies WHERE task_id = ?', [task.id]);
      task.dependencies = deps.map(d => d.depends_on_task_id);

      // Commentaires
      const [comments] = await db.query(`
        SELECT c.id, u.name AS author, c.text, c.created_at AS timestamp
        FROM task_comments c
        JOIN users u ON c.author_id = u.id
        WHERE c.task_id = ?
        ORDER BY c.created_at ASC
      `, [task.id]);
      task.comments = comments;
    }

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des tâches', details: err.message });
  }
};

// Créer une nouvelle tâche
exports.createTask = async (req, res) => {
  const { title, description, project_id, assignee_id, status, priority, dueDate, sprintId, subtasks, dependencies } = req.body;
  const id = `TSK-${Date.now().toString().slice(-4)}`;

  try {
    await db.query(
      `INSERT INTO tasks (id, title, description, project_id, assignee_id, status, priority, due_date, sprint_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, title, description || '', project_id, assignee_id || null, status || 'todo', priority || 'medium', dueDate, sprintId || null]
    );

    // Sous-tâches
    if (subtasks && Array.isArray(subtasks)) {
      for (let st of subtasks) {
        const subId = `SUB-${Date.now().toString().slice(-4)}-${Math.floor(Math.random()*100)}`;
        await db.query('INSERT INTO subtasks (id, task_id, title, completed) VALUES (?, ?, ?, ?)', [subId, id, st.title, st.completed || false]);
      }
    }

    // Dépendances
    if (dependencies && Array.isArray(dependencies)) {
      for (let depId of dependencies) {
        await db.query('INSERT INTO task_dependencies (task_id, depends_on_task_id) VALUES (?, ?)', [id, depId]);
      }
    }

    res.status(201).json({ message: 'Tâche créée avec succès', taskId: id });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la création de la tâche', details: err.message });
  }
};

// Mettre à jour une tâche
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, status, priority, assignee_id, due_date, sprint_id } = req.body;

  try {
    await db.query(
      `UPDATE tasks 
       SET title = COALESCE(?, title),
           status = COALESCE(?, status),
           priority = COALESCE(?, priority),
           assignee_id = COALESCE(?, assignee_id),
           due_date = COALESCE(?, due_date),
           sprint_id = COALESCE(?, sprint_id)
       WHERE id = ?`,
      [title, status, priority, assignee_id, due_date, sprint_id, id]
    );

    res.json({ message: 'Tâche mise à jour avec succès' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la tâche', details: err.message });
  }
};

// Réassigner des tâches en masse
exports.reassignTasksBulk = async (req, res) => {
  const { reassignments } = req.body; // Array of { taskId, newAssigneeNameOrId }

  try {
    if (Array.isArray(reassignments)) {
      for (const item of reassignments) {
        if (item.taskId && item.newAssignee) {
          await db.query('UPDATE tasks SET assignee_id = ? WHERE id = ?', [item.newAssignee, item.taskId]);
        }
      }
    }
    res.json({ message: 'Réassignation globale effectuée avec succès' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la réassignation en masse', details: err.message });
  }
};

// Supprimer une tâche
exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM tasks WHERE id = ?', [id]);
    res.json({ message: 'Tâche supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la tâche', details: err.message });
  }
};

// Dupliquer une tâche
exports.duplicateTask = async (req, res) => {
  const { id } = req.params;
  const newId = `TSK-${Date.now().toString().slice(-4)}`;

  try {
    const [tasks] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
    if (tasks.length === 0) return res.status(404).json({ error: 'Tâche non trouvée' });

    const original = tasks[0];
    await db.query(
      `INSERT INTO tasks (id, title, description, project_id, assignee_id, status, priority, due_date, sprint_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [newId, `${original.title} (Copie)`, original.description, original.project_id, original.assignee_id, original.status, original.priority, original.due_date, original.sprint_id]
    );

    // Dupliquer les sous-tâches
    const [subtasks] = await db.query('SELECT title, completed FROM subtasks WHERE task_id = ?', [id]);
    for (let st of subtasks) {
      const subId = `SUB-${Date.now().toString().slice(-4)}-${Math.floor(Math.random()*100)}`;
      await db.query('INSERT INTO subtasks (id, task_id, title, completed) VALUES (?, ?, ?, ?)', [subId, newId, st.title, st.completed]);
    }

    res.status(201).json({ message: 'Tâche dupliquée avec succès', taskId: newId });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la duplication', details: err.message });
  }
};

// Ajouter un commentaire à une tâche
exports.addComment = async (req, res) => {
  const { taskId } = req.params;
  const { author_id, text } = req.body;
  const commentId = `CMT-${Date.now().toString().slice(-4)}`;

  try {
    await db.query('INSERT INTO task_comments (id, task_id, author_id, text) VALUES (?, ?, ?, ?)', [commentId, taskId, author_id, text]);
    res.status(201).json({ message: 'Commentaire ajouté avec succès', commentId });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout du commentaire', details: err.message });
  }
};
