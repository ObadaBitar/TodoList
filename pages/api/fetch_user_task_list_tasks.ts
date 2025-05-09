import { fetch_user_task_list_tasks } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { taskListID } = req.body;

  if (!taskListID || typeof taskListID !== "number") {
    return res.status(400).json({ message: "Invalid userID" });
  }

  try {
    const tasks = await fetch_user_task_list_tasks(taskListID);
    return res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error fetching task lists:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}