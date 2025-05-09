import { RowDataPacket } from "mysql2/promise";
import { ResultSetHeader } from 'mysql2/promise';
import pool from "@/lib/db_config";

// // // // // // // // // //      CHECK     // / // // // / / /// 

interface Result extends RowDataPacket {
  isUserNameUnique: number;
  isEmailUnique: number;
  isTaskListNameUnique: number;
  isValidUser: number;
  userID: number;
  insertedUserID: number;
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

const check_task_list_name = async (userID: number, taskListName: string): Promise<boolean> => {
  try {
    const query =
      `
      SELECT 
      EXISTS(SELECT 1 FROM tasklist WHERE userID = ? AND taskListName = ?)
      AS isTaskListNameUnique 
    `;
    const [rows] = await pool.execute<Result[]>(query, [userID, taskListName]);
    const isUnique = rows[0].isTaskListNameUnique === 0;
    return isUnique;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch data.");
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

// // // // // // // // // //      ADD     // / // // // / / /// 

const add_user = async (userName: string, userEmail: string, userPassword: string): Promise<number> => {
  try {
    // Use the pool directly with transaction
    await pool.query('START TRANSACTION');

    try {
      // Fix the SQL syntax
      const userQuery = `
        INSERT INTO user (userName, userEmail, userPassword)
        VALUES (?, ?, ?)
      `;
      const [rows] = await pool.execute<ResultSetHeader>(userQuery, [userName, userEmail, userPassword]);
      const userId = rows.insertId;

      // Create default task list
      const taskListQuery = `
        INSERT INTO tasklist (userID, taskListName, isSystem)
        VALUES (?, ?, 1)
      `;
      await pool.execute(taskListQuery, [userId, "Unassigned Tasks"]);

      await pool.query('COMMIT');
      return userId;
    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to add user.");
  }
};

const add_task_list = async (userID: number, taskListName: string): Promise<number> => {
  try {
    const query = `
      INSERT INTO tasklist (userID, taskListName, isSystem)
      VALUES (?, ?, 0)
    `;
    const [rows] = await pool.execute<ResultSetHeader>(query, [userID, taskListName]);
    return rows.insertId
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to add task list.");
  }
};

const add_task = async (taskListID: number, taskName: string, taskDescription: string): Promise<number> => {
  try {
    const query =
      `
      INSERT INTO task (taskListID, taskName, taskDescription, taskStatus)
      VALUES (?, ?, ?, 0)
    `;
    const [rows] = await pool.execute<ResultSetHeader>(query, [taskListID, taskName, taskDescription]);
    return rows.insertId
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to add task list.");
  }
};

// // // // // // // // // //      EDIT     // / // // // / / /// 

const edit_task = async (taskID: number, taskListID: number, taskName: string, taskDescription: string, taskStatus: number): Promise<boolean> => {
  try {
    const query =
      `
      UPDATE task
      SET taskListID = ?, taskName = ?, taskDescription = ?, taskStatus = ?
      WHERE taskID = ?
    `;
    const [rows] = await pool.execute<ResultSetHeader>(query, [taskListID, taskName, taskDescription, taskStatus, taskID]);
    return rows.affectedRows > 0;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to update task.");
  }
};

// // // // // // // // // //      DELETE     // / // // // / / /// 

const delete_task_list = async (taskListID: number): Promise<boolean> => {
  try {
    await pool.query('START TRANSACTION');

    try {
      const deleteTasksQuery = `
        DELETE FROM task
        WHERE taskListID = ?
      `;
      await pool.execute<ResultSetHeader>(deleteTasksQuery, [taskListID]);

      const deleteTaskListQuery = `
        DELETE FROM tasklist
        WHERE taskListID = ?
      `;
      const [result] = await pool.execute<ResultSetHeader>(deleteTaskListQuery, [taskListID]);

      await pool.query('COMMIT');
      return result.affectedRows > 0;
    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }
  }
  catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete task list.");
  }
};


const delete_task = async (taskID: number): Promise<boolean> => {
  try {
    const query = `
      DELETE FROM task
      WHERE taskID = ?
    `;
    const [result] = await pool.execute<ResultSetHeader>(query, [taskID]);
    return result.affectedRows > 0;
  }
  catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete task.");
  }
};


// // // // // // // // // //      FETCH     // / // // // / / /// 

interface UserTaskLists extends RowDataPacket {
  taskListID: number;
  taskListName: string;
  isSystem: number;
}

const fetch_user_task_lists = async (userID: number): Promise<UserTaskLists[]> => {
  try {
    const query =
      `
      SELECT taskListID, taskListName, isSystem
      FROM tasklist
      WHERE userID = ?
      ORDER BY isSystem DESC, taskListName ASC
    `;
    const [rows] = await pool.execute<UserTaskLists[]>(query, [userID]);
    return rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch data.");
  }
};

interface UserTasks extends RowDataPacket {
  taskID: number;
  taskListID: string;
  taskName: string;
  taskDescription: string;
  taskStatus: number;
}

const fetch_user_task_list_tasks = async (taskListID: number): Promise<UserTasks[]> => {
  try {
    const query =
      `
      SELECT taskID, taskListID, taskName, taskDescription, taskStatus
      FROM task
      WHERE taskListID = ?
      ORDER BY taskStatus ASC, taskName ASC
    `;
    const [rows] = await pool.execute<UserTasks[]>(query, [taskListID]);
    return rows;
  }
  catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch data.");
  }
};

export {
  // PERSNAL USER

  check_username, check_email, check_task_list_name,

  check_valid_user,

  add_user, add_task_list, add_task,

  edit_task,

  delete_task_list, delete_task,

  fetch_user_task_lists, fetch_user_task_list_tasks,


};
