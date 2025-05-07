import {fetch_user_task_lists } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { userID } = req.body;

    if (!userID || typeof userID !== "number") {
        return res.status(400).json({ message: "Invalid userID" });
    }

    try {
        const taskLists = await fetch_user_task_lists(userID);
        return res.status(200).json({ taskLists });
    } catch (error) {
        console.error("Error fetching task lists:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}