import dotenv from "dotenv";
import pkg from 'pg';

const { Pool } = pkg;

dotenv.config();

const databaseConfig = { connectionString: process.env.DATABASE_URL };
const pool = new Pool(databaseConfig);

pool.on("connect", () => {
  console.log("Database connected");
});

export default pool;
