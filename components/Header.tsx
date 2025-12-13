"use client";

import { usePathname } from "next/navigation";

export function Header() {
    const pathname = usePathname();

    const getTitle = () => {
        if (pathname === "/dashboard") return "Overview";
        if (pathname.includes("/dashboard/clients")) return "Clients";
        if (pathname.includes("/dashboard/calendar")) return "Calendar";
        if (pathname.includes("/dashboard/email")) return "Email Center";
        return "Dashboard";
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/50 px-6 backdrop-blur-md transition-all">
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold text-foreground">{getTitle()}</h1>
            </div>
            <div className="flex items-center gap-4">
                <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-sm">
                    U
                </div>
            </div>
        </header>
    );
}
