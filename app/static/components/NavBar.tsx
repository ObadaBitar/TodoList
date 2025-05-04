"use client";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    // NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";

const links: { items: { title: string; href: string; group: number; enabled: boolean; active: boolean; toggle?: typeof ModeToggle }[] }[] = [
    {
        items: [
            {
                title: "Contact Us",
                href: "/static/contact-us",
                group: 1,
                enabled: true,
                active: false,
            },

            {
                title: "About Us",
                href: "/static/about-us",
                group: 1,
                enabled: true,
                active: false,
            },
        ],
    },
    {
        items: [
            {
                title: "Log in",
                href: "/static/login",
                group: 2,
                enabled: true,
                active: false,
            },
            {
                title: "Create Account",
                href: "/static/register",
                group: 2,
                enabled: true,
                active: false,
            },
            {
                title: "Toggle Mode",
                href: "/",
                group: 2,
                enabled: true,
                active: false,
                toggle: ModeToggle,
            },
        ]
    }
];

interface NavBarProps {
    pageName: string;
}

export default function NavBar({ pageName = "" }: NavBarProps) {
    const pathname = usePathname(); // TODO:
    const updatedLinks = links.map((group) => ({
        items: group.items.map((link) => ({
            ...link,
            active: link.href === pathname,
        })),
    }));


    return (
        <header>
            <NavigationMenu className="flex sticky top-0 p-4 w-screen">
                <ul className="flex gap-2 justify-between w-full">
                    <Button variant="ghost" className="hidden text-foreground">
                        ☰
                    </Button>
                    {pageName && (< div>
                        <h1>{pageName}</h1>
                    </div>)}
                    {updatedLinks.map((group, index) =>
                        <div key={index} className="flex gap-2">
                            {group.items.map(
                                (link) =>
                                    link.toggle ? (
                                        <ModeToggle key={link.title} />
                                    ) : (
                                        link.enabled && (
                                            <NavigationMenuItem key={link.title}>
                                                <NavigationMenuLink
                                                    href={link.href}
                                                    variant={link.active ? "active" : "default"}
                                                    className="text-foreground px-6 py-2 rounded-md text-sm"
                                                >{link.title}
                                                </NavigationMenuLink>
                                            </NavigationMenuItem>
                                        )
                                    )
                            )}
                        </div>
                    )}
                </ul>
            </NavigationMenu>
        </header>
    );
}