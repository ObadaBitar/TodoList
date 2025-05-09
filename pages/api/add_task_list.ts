import { NextApiRequest, NextApiResponse } from "next";
import { add_task_list } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { userID, taskListName } = req.body;

    if (!userID || typeof userID !== "number" || !taskListName || typeof taskListName !== "string") {
        return res.status(400).json({ message: "Invalid task list data" });
    }

    try {
        const taskListID = await add_task_list(userID, taskListName);
        return res.status(200).json({ taskListID });
    } catch (error) {
        console.error("Error adding task list:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}