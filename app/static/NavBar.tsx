"use client";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { usePathname } from "next/navigation";

const links: { title: string; href: string; enabled: boolean, active: boolean,}[] = [
    {
        title: "Contact us",
        href: "/static/contact-us",
        enabled: true,
        active: false,
    },
    {
        title: "Login",
        href: "/static/login",
        enabled: true,
        active: false,
    },
];

interface NavBarProps {
    pageName: string;
}

export default function NavBar({ pageName = "" }: NavBarProps) {
    const pathname = usePathname(); // Get the current route
    const currentLink = links.find((link) => link.href === pathname);
    if (currentLink) {
        currentLink.active = true; // Set the active link based on the current route
    }
    console.log(`Current pathname: ${pathname}`);

    return (
        <header>
            <NavigationMenu className="flex sticky top-0 p-4 w-screen">
                <NavigationMenuList className="flex gap-2 justify-end w-full">
                    {pageName && <h1>{pageName}</h1>}
                    <NavigationMenuItem>
                        <Button variant="ghost" className="hidden text-foreground">
                            ☰
                        </Button>
                    </NavigationMenuItem>
                    {links.map(
                        (link) =>
                            link.enabled && (
                                <NavigationMenuItem key={link.title}>
                                    <NavigationMenuLink
                                        href={link.href}
                                        className={
                                            `text-foreground px-6 py-2 rounded-md text-sm 
                                            ${link.active ? ` ` : ``}  `}>
                                        {link.title}
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            )
                    )}
                </NavigationMenuList>
            </NavigationMenu>
        </header>
    );
}