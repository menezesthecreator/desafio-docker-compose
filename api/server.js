const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
app.use(express.json());

const port = Number(process.env.PORT || 3000);

const dbConfig = {
  host: process.env.DB_HOST || "db",
  port: Number(process.env.DB_PORT || 3306),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
};

const pool = mysql.createPool(dbConfig);

async function initDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS notas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      titulo VARCHAR(120) NOT NULL,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

app.get("/health", async (_req, res) => {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    res.status(200).json({ status: "ok", db: "connected" });
  } catch (err) {
    res.status(500).json({ status: "error", db: "disconnected", message: err.message });
  }
});

app.get("/notas", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, titulo, criado_em FROM notas ORDER BY id DESC");
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/notas", async (req, res) => {
  const { titulo } = req.body;
  if (!titulo || !titulo.trim()) {
    return res.status(400).json({ error: "O campo 'titulo' é obrigatório." });
  }

  try {
    const [result] = await pool.query("INSERT INTO notas (titulo) VALUES (?)", [titulo.trim()]);
    res.status(201).json({ id: result.insertId, titulo: titulo.trim() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function start() {
  try {
    await initDatabase();
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  } catch (err) {
    console.error("Falha ao inicializar o banco:", err.message);
    process.exit(1);
  }
}

start();