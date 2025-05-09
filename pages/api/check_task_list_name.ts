import { NextApiRequest, NextApiResponse } from "next";
import { check_task_list_name } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { userID, taskListName } = req.body;

    if (typeof userID !== "number" || typeof taskListName !== "string") {
        console.error("Invalid data", userID, taskListName)
        return res.status(400).json({ message: "Invalid data" });
    }

    try {
        const isUnique = await check_task_list_name(userID, taskListName);
        return res.status(200).json({ isUnique });
    } catch (error) {
        console.error("Error checking task list name:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}