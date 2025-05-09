"use client";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    // NavigationMenuList,
} from "@/components/ui/navigation-menu";
import * as React from "react";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Drawer, DrawerTitle, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { MenuIcon } from "lucide-react";

const links = [
    {
        items: [
            { title: "Group tasks", href: "/dashboard/group-tasks", enabled: true },
            { title: "Personal tasks", href: "/dashboard/personal-tasks", enabled: true },
        ],
    },
    {
        items: [
            { title: "Log out", href: "/static/login", enabled: true },
            { title: "Toggle Mode", href: "/NULL", enabled: true, toggle: ModeToggle },
        ],
    },
];

interface NavBarProps {
    pageName: string;
}

export default function NavBar({ pageName }: NavBarProps) {
    const pathname = usePathname();
    const isMobile = useMediaQuery("(max-width: 768px)");

    const updatedLinks = links.map((group) => ({
        items: group.items.map((link) => ({
            ...link,
            active: link.href === pathname,
        })),
    }));

    return (
        <header>
            {/* REF: https://www.youtube.com/watch?v=9d_3IMl3jvQ */}
            <NavigationMenu className="flex sticky top-0 p-4 w-screen">
                <ul className="flex gap-2 flex-wrap justify-between items-center w-full">
                    {isMobile ? (
                        <>
                            <ModeToggle />
                            <h1 className="text-4xl">{pageName}</h1>
                            < Drawer direction="right">
                                <DrawerTrigger>
                                    <MenuIcon className="border rounded-md p-1 h-full w-full" />
                                </DrawerTrigger>
                                <DrawerContent className="p-4 ">
                                    <DrawerTitle>
                                    </DrawerTitle>
                                    <ul className="flex flex-col gap-8 justify-between h-full w-full">
                                        <h1 className="text-4xl w-full text-center">{pageName}</h1>
                                        {updatedLinks
                                            .filter((group) => group.items.some((link) =>
                                                link.enabled
                                                && link.title !== "PageName"
                                                && link.title !== "Toggle Mode"
                                            ))
                                            .map((group, index) => (
                                                <div key={index} className="flex flex-col gap-3">
                                                    {group.items.map(
                                                        (link) => (link.title !== "Toggle Mode" && (
                                                            <NavigationMenuItem key={link.title}>
                                                                <NavigationMenuLink
                                                                    href={link.href}
                                                                    variant={link.active ? "active" : "default"}
                                                                    className="text-foreground text-center px-6 py-4 rounded-md text-sm aligm-center"
                                                                >
                                                                    {link.title}
                                                                </NavigationMenuLink>
                                                            </NavigationMenuItem>
                                                        )
                                                        )
                                                    )}
                                                </div>
                                            )
                                            )}
                                    </ul>
                                </DrawerContent>
                            </Drawer>
                        </>
                    ) : (
                        <>
                            {
                                updatedLinks.map((group, index) =>
                                    <div key={index} className="flex gap-2">
                                        {group.items.map(
                                            (link) =>
                                                link.toggle ? (
                                                    <ModeToggle key={link.title} />
                                                )
                                                    : link.title == "PageName" ? (
                                                        < div className="center-center" key={link.title}>
                                                            <h1 className="text-3xl font-medium">{pageName}</h1>
                                                        </div>
                                                    )
                                                        : (
                                                            link.enabled && (
                                                                <NavigationMenuItem key={link.title}>
                                                                    <NavigationMenuLink
                                                                        href={link.href}
                                                                        variant={link.active ? "active" : "default"}
                                                                        className="text-foreground px-6 py-2 rounded-md text-sm aligm-center"                                                        >{link.title}
                                                                    </NavigationMenuLink>
                                                                </NavigationMenuItem>
                                                            )
                                                        )
                                        )}
                                    </div>
                                )
                            }
                        </>
                    )}
                </ul>
            </NavigationMenu>
        </header>
    );
}