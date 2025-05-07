"use client";
import NavBar from "@/app/dashboard/components/nav-bar";
import ResponsiveTitle from "@/components/responsive-title";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    // DropdownMenuGroup,
    DropdownMenuItem,
    // DropdownMenuLabel,
    // DropdownMenuPortal,
    // DropdownMenuSeparator,
    // DropdownMenuShortcut,
    // DropdownMenuSub,
    // DropdownMenuSubContent,
    // DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import useUserId from "@/app/dashboard/components/get-userID";

const fetchUserTaskLists = async (userId: number) => {
    try {
        const response = await fetch("/api/fetch_user_task_lists", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userID: userId }),
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        return data.taskLists;
    } catch (error) {
        console.error("Error fetching task lists:", error);
        return null;
    }
}

//////////////////////////////////////////////////////////////

export default function PersonalTasks() {
    const [taskLists, setTaskLists] = useState<{ taskListID: number; taskListName: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTaskList, setSelectedTaskList] = useState<{ taskListID: number; taskListName: string }>
        ({ taskListID: 0, taskListName: "Select Task List" });

    const userId = useUserId();
    console.log("User ID:", userId);

    useEffect(() => {
        const fetchData = async () => {
            const lists = await fetchUserTaskLists(Number(userId));
            if (lists) {
                setTaskLists(lists);
                console.log("Task Lists:", lists);
            }
            setLoading(false);
        };
        fetchData();
    }, [userId]);

    useEffect(() => {
        if (selectedTaskList.taskListID > 0) {
            setSelectedTaskList(taskLists[0]);
        }
    }, [selectedTaskList]);

    return (
        <>
            <NavBar pageName="Personal Tasks" />
            <main className="py-1">
                <ResponsiveTitle title="Personal Tasks" />
                <DropdownMenu >
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="text-lg p-6" >{selectedTaskList.taskListName}</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-100 h-100 overflow-auto">
                        {loading ? (
                            <div className="flex items-center justify-center h-20">Loading...</div>
                        ) : taskLists.length > 0 ? (
                            taskLists.map((taskList) => (
                                <DropdownMenuItem
                                    key={taskList.taskListID}
                                    onClick={() => {
                                        setSelectedTaskList(taskList);
                                        console.log("Selected Task List:", taskList);
                                    }}
                                >
                                    {taskList.taskListName}
                                </DropdownMenuItem>
                            ))
                        ) : (
                            <div className="flex items-center justify-center h-20">No task lists found</div>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </main >
        </>
    );
}   