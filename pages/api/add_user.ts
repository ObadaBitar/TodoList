import { NextApiRequest, NextApiResponse } from "next";
import { add_user } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { username, email, password } = req.body;

    if (!email || typeof email !== "string") {
        return res.status(400).json({ message: "Invalid user data" });
    }

    try {
        const addUser = await add_user(username, email, password);
        return res.status(200).json({ addUser });
    } catch (error) {
        console.error("Error adding user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}