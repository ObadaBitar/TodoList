"use client";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function ResponsiveTitle({ title }: { title: string }) {
    const isMobile = useMediaQuery("(max-width: 768px)");

    return (
        isMobile ?(<></>) :(<h1 className="text-5xl w-full text-center p-4">{title}</h1>)
    );
}