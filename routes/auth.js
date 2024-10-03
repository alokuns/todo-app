import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

// Registreringsrute
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // Sjekk om brukernavn eller passord mangler
  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  // Sjekk om brukeren allerede eksisterer
  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, result) => {
      if (err || result.length > 0) {
        return res.status(400).send("Username already exists");
      }
    }
  );

  // Hash passordet
  const hashedPassword = await bcrypt.hash(password, 10);

  // Sett inn den nye brukeren i databasen
  db.query(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hashedPassword],
    (err, result) => {
      if (err) {
        return res.status(500).send("Error registering user");
      }
      res.status(201).send("User registered");
    }
  );
});

// Innloggingsrute
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Finn brukeren ved brukernavn
  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, users) => {
      if (err) {
        return res.status(500).send("Server error");
      }
      // Sjekk om brukernavn ikke er registrert
      if (users.length === 0) {
        return res.status(400).send("Invalid credentials");
      }

      // Hent ut brukeren fra databasen
      const user = users[0];

      // Sammenlign det angitte passordet med det lagrede hashede passordet
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).send("Invalid credentials");
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.cookie("token", token, { httpOnly: true });
      res.send("Logged in");
    }
  );
});

// Utloggingsrute
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.send("Logged out successfully");
});

/* // Registrer en ny bruker (uten cookies og tokens)
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Sjekk om brukeren allerede eksisterer
    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    if (rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Brukernavn eksisterer allerede" });
    }

    // Hash passordet
    const hashedPassword = await bcrypt.hash(password, 10);

    // Sett inn den nye brukeren i databasen
    await db.query("INSERT INTO users (username, password) VALUES (?, ?)", [
      username,
      hashedPassword,
    ]);

    res.status(201).json({ message: "Bruker registrert vellykket" });
  } catch (error) {
    res.status(500).json({ message: "Serverfeil" });
  }
}); */

/* // Innloggingsrute (uten cookies og tokens)
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Finn brukeren ved brukernavn
    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    if (rows.length == 0) {
      return res
        .status(400)
        .json({ message: "Ugyldig brukernavn eller passord" });
    }

    const user = rows[0];

    // Sammenlign det angitte passordet med det lagrede hashede passordet
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Ugyldig brukernavn eller passord" });
    }

    // Generer en enkel token (eller vurder JWT for mer robust autentisering)
    // Her kan du eventuelt sende en token som respons i stedet for å bruke sesjoner
    res.json({ message: "Innlogging vellykket" });
  } catch (error) {
    res.status(500).json({ message: "Serverfeil" });
  }
}); */

export default router;
