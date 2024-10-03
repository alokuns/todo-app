import { Router } from "express";
import db from "../config/db.js";
import authMiddleware from "../config/authMiddleware.js";

const router = Router();

// Hent Todos for innlogget bruker
router.get("/", authMiddleware, (req, res) => {
  db.query(
    "SELECT * FROM todos WHERE user_id = ?",
    [req.user.id],
    (err, todos) => {
      if (err) return res.status(500).send("Error fetching todos");
      res.json(todos);
    }
  );
});

// Legg til ny Todo
router.post("/", authMiddleware, (req, res) => {
  const { task } = req.body;

  db.query(
    "INSERT INTO todos (user_id, task) VALUES (?, ?)",
    [req.user.id, task],
    (err, result) => {
      if (err) return res.status(500).send("Error adding todo");
      res.status(201).send("Todo added");
    }
  );
});

export default router;
