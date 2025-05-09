import { NextApiRequest, NextApiResponse } from "next";
import { edit_task } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { taskID, taskListID, taskName, taskDescription, taskStatus } = req.body;

  if (!taskID || typeof taskID !== "number" ||
    !taskListID || typeof taskListID !== "number" ||
    !taskName || typeof taskName !== "string" ||
    typeof taskDescription !== "string" ||
    !Number.isInteger(taskStatus)) {
    return res.status(400).json({ message: "Invalid task data" });
  }

  try {
    const success = await edit_task(taskID, taskListID, taskName, taskDescription, taskStatus);
    if (success) {
      return res.status(200).json({ success: true });
    }
  } catch (error) {
    console.error("Error editing task:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}