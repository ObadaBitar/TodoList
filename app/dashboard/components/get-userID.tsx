"use client"
// import { useEffect } from "react";

export default function useUserId() {
    const storedUserId = localStorage.getItem('userId');
    return storedUserId;
}