import { RowDataPacket } from "mysql2/promise";
import pool from "@/lib/db_config";

interface IsUniqueResult extends RowDataPacket {
  isUserNameUnique: number;
  isEmailUnique: number;
}

const check_username = async (username: string): Promise<boolean> => {
  try {
    const query =
    `
      SELECT 
      EXISTS(SELECT 1 FROM user WHERE userName = ?) 
      AS isUserNameUnique
    `;
    const [rows] = await pool.execute<IsUniqueResult[]>(query, [username]);
    const isUnique = rows[0].isUserNameUnique === 0;
    return isUnique;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch data.");
  }
};

const check_email = async (email: string): Promise<boolean> => {
  try {
    const query =
      `
      SELECT 
      EXISTS(SELECT 1 FROM user WHERE userEmail = ?) 
      AS isEmailUnique
    `;
    const [rows] = await pool.execute<IsUniqueResult[]>(query, [email]);
    const isUnique = rows[0].isEmailUnique === 0;
    return isUnique;
  }
  catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch data.");
  }
};

const add_user = async (username: string, email: string, password: string): Promise<boolean> => {
  try {
    const query =
      `
      INSERT INTO user (userName, userEmail, userPassword)
      VALUES (?, ?, ?)
    `;
    await pool.execute(query, [username, email, password]);
    return true;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to add user.");
  }
};

export {
  check_username, check_email,
  add_user
};
