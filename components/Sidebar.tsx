"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, Calendar, Mail, FileText, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { href: "/dashboard/clients", icon: Users, label: "Clients" },
    { href: "/dashboard/calendar", icon: Calendar, label: "Calendar" },
    { href: "/dashboard/email", icon: Mail, label: "Email" },
    { href: "/dashboard/templates", icon: FileText, label: "Templates" },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    return (
        <aside className="hidden h-screen w-64 flex-col border-r bg-card text-card-foreground md:flex">
            <div className="flex h-16 items-center px-6 border-b">
                <div className="flex items-center gap-2 font-bold text-xl text-primary">
                    <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-primary">CM</span>
                    </div>
                    ClientManager
                </div>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
                <nav className="grid gap-1 px-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                    isActive ? "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary" : "text-muted-foreground"
                                )}
                            >
                                <item.icon className="size-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className="border-t p-4">
                <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                    <LogOut className="size-4" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
