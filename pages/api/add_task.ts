import { NextApiRequest, NextApiResponse } from "next";
import { add_task } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { taskListID, taskName, optionalDescription } = req.body;

    if (!taskListID || typeof taskListID !== "number" ||
        !taskName || typeof taskName !== "string") {
        return res.status(400).json({
            message: "Invalid task data. Required: taskListID (number) and taskName (string)"
        });
    }

    const taskDescription = optionalDescription || "";

    try {
        const taskID = await add_task(taskListID, taskName, taskDescription);
        return res.status(200).json({ taskID });
    } catch (error) {
        console.error("Error adding task:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}