import { NextApiRequest, NextApiResponse } from "next";
import { check_email } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { email } = req.body;

    if (!email || typeof email !== "string") {
        return res.status(400).json({ message: "Invalid email" });
    }

    try {
        const isUnique = await check_email(email);
        return res.status(200).json({ isUnique });
    } catch (error) {
        console.error("Error checking email:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}