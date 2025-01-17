import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

router.get("/ping", async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM user'); // pool.query ahora devuelve una Promesa
    console.log(rows);
    res.json(rows); // Retorna los datos al cliente
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

export default router;