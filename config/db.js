import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const connection = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "todo_app",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL");
});

export default connection;
