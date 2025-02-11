import { pool } from "../db.js";

export const getTasks = async (req, res) => {
  try {
    const [result] = await pool.query("SELECT * FROM tasks;");
    res.json(result)
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

export const getTask = async (req, res) => {
  try {
    const { id } = req.params
    const [result] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    if (result.length === 0) {
      res.status(404).json({ message: 'Task not found' })
    } else {
      res.json(result[0])
    }
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { task, username } = req.body;
    const { title, description } = task;
    const [result] = await pool.query("INSERT INTO tasks (title, description, created_by) VALUES (?, ?, ?)", [title, description, username]);
    res.json({
      id: result.insertId,
      title, description, username
    })
  } catch (err) {
    res.status(500).json({ err: err.message, err2: 'Error in createTask' });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params
    const [result] = await pool.query('UPDATE tasks SET ? where id = ?', [req.body, id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Task not found' })
    } else {
      return res.sendStatus(204)
    }
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params
    const [result] = await pool.query('DELETE from tasks where id = ?', [id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Task not found' })
    } else {
      return res.sendStatus(204)
    }
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};