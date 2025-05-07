import { RowDataPacket } from "mysql2/promise";
import pool from "@/lib/db_config";

interface Result extends RowDataPacket {
  isUserNameUnique: number;
  isEmailUnique: number;
  isValidUser: number;
}

const check_username = async (username: string): Promise<boolean> => {
  try {
    const query =
      `
      SELECT 
      EXISTS(SELECT 1 FROM user WHERE userName = ?) 
      AS isUserNameUnique
    `;
    const [rows] = await pool.execute<Result[]>(query, [username]);
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
    const [rows] = await pool.execute<Result[]>(query, [email]);
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

const check_valid_user = async (userName: string, userPassword: string): Promise<number> => {
  try {
    const query =
      `
      SELECT userID
      FROM user
      WHERE userName = ? AND userPassword = ?
    `;
    const [rows] = await pool.execute<Result[]>(query, [userName, userPassword]);
    if (rows.length === 0) {
      return 0; 
    }
     return rows[0].userID;;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch data.");
  }
};

interface UserTaskLists extends RowDataPacket {
  taskListID: number;
  taskListName: string;
}

const fetch_user_task_lists = async (userID: number): Promise<UserTaskLists[]> => {
  try {
    const query =
      `
      SELECT taskListID, taskListName
      FROM tasklist
      WHERE userID = ?
    `;
    const [rows] = await pool.execute<UserTaskLists[]>(query, [userID]);
    return rows;
  }
  catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch data.");
  }
};

export {
  check_username, check_email,
  add_user,
  check_valid_user,
  fetch_user_task_lists,
};
