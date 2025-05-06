import { NextApiRequest, NextApiResponse } from "next";
import { check_username } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { username } = req.body;

    if (!username || typeof username !== "string") {
        return res.status(400).json({ message: "Invalid username" });
    }

    try {
        const isUnique = await check_username(username);
        return res.status(200).json({ isUnique });
    } catch (error) {
        console.error("Error checking username:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}