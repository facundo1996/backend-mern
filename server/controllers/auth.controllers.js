import { pool } from "../db.js";
import bcrypt from "bcrypt";
import jwt, { decode } from "jsonwebtoken";
import { TOKEN_SECRET, NODE_ENV } from "../config.js"
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
      username: user[0].username,
      role: user[0].role
    })

    res.cookie('token', token, {
      httpOnly: true, // Esto dice que la cookie solo se puede acceder desde el servidor
      secure: NODE_ENV === 'production', // La cookie solo se puede acceder en https
      sameSite: 'strict', // Protege contra CSRF
      maxAge: 1000 * 60 * 60 // La cookie tiene validez de 1 hora
    });

    res.json({
      id: user[0].id,
      username: user[0].username,
      role: user[0].role
    })

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

export const logout =  (req, res) => {
  res.clearCookie('token');
  return res.sendStatus(200)
}

export const verifyToken = (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    res.json({ id: decoded.id, username: decoded.username, role: decoded.role });
  });
};