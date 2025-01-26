import { pool } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authRequired } from "../middlewares/validateToken.js"
import { createAccessToken } from "../libs/jwt.js"

export const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10)
    const [result] = await pool.query("INSERT INTO users (id, username, password) VALUES (uuid(), ?, ?)", [username, hashedPassword]);
    res.json(result)
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

export const login = async (req, res) => {
  try {

    const { username, password } = req.body;
    const [user] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
    if (user.length === 0) {
      return res.status(404).json({ message: 'Username Incorrect' });
    }

    const isValid = await bcrypt.compareSync(password, user[0].password);

    if (!isValid) {
      return res.status(404).json({ message: 'Password Incorrect' });
    }
    
    const token = await createAccessToken({
      id: user[0].id,
      username: user[0].username
    })

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax' // Protege contra CSRF
    });

    res.json({
      id: user[0].id,
      username: user[0].username
    })

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

export const logout =  (req, res) => {
  res.cookie(
    'token',
    '',
    { expires: new Date(0) }
  )
  return res.sendStatus(200)
}