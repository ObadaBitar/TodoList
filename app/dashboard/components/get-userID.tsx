"use client";
import { useState, useEffect } from "react";

export default function useUserId() {
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        setUserId(storedUserId);
    }, []);

    return userId;
}