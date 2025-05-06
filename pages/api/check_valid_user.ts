import { NextApiRequest, NextApiResponse } from "next";
import { check_valid_user } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { userName, userPassword } = req.body;

    if (typeof userName !== "string" || typeof userPassword !== "string") {
        return res.status(400).json({ message: "Invalid data" });
    }

    try {
        const isValidUser = await check_valid_user(userName, userPassword);
        return res.status(200).json({ isValidUser });
    } catch (error) {
        console.error("Error checking user validity:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}