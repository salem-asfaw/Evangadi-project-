import dotenv from "dotenv";
dotenv.config();

import mysql from "mysql2/promise";

// Debug logs (you can remove later)
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_USER:", process.env.DB_USER);

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT),
  ssl: {
    rejectUnauthorized: false,
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

//  THIS WAS MISSING (causing your crash)
export const safeExecute = async (sql, params) => {
  if (typeof sql !== "string" || sql.trim() === "") {
    throw new Error("SQL query must be a non-empty string");
  }

  if (params === undefined || params === null) {
    throw new Error("SQL parameters are required");
  }

  const [result] = await db.execute(sql, params);
  return result;
};
