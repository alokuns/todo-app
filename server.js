import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import todoRoutes from "./routes/todos.js";

const app = express();

// Middelware
app.use(express.json());
app.use(cookieParser()); // For å håndtere cookies

// Ruter for autentisering og Todo-oppgaver
app.use("/auth", authRoutes);
app.use("/todos", todoRoutes);

// Start serveren
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveren kjører på port ${PORT}`);
});
