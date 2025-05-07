"use client";
import NavBar from "@/app/dashboard/components/nav-bar";
import ResponsiveTitle from "@/components/responsive-title";

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


export default function GroupTasks() {
    const userId = useUserId();
    console.log("User ID:", userId);
    return (
        <>
            <NavBar pageName="Personal Tasks" />
            <main className="py-1">
                <ResponsiveTitle title="Personal Tasks" />
                <DropdownMenu >
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="text-1xl p-6" >Task list</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-100 h-100 overflow-auto">
                        <DropdownMenuItem >
                            Task list 1
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            Task list 2
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            Task list 3
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            Task list 4
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </main >
        </>
    );
}   