import { createClient } from "@/lib/supabase/server";
import { Users, Mail, Calendar, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { count: clientCount } = await supabase
        .from("clients")
        .select("*", { count: "exact", head: true });

    const stats = [
        {
            name: "Total Clients",
            value: clientCount || 0,
            icon: Users,
            href: "/dashboard/clients",
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            name: "Emails Sent",
            value: "N/A", // We'd need a table for this to track it
            icon: Mail,
            href: "/dashboard/email",
            color: "text-purple-500",
            bg: "bg-purple-500/10",
        },
        {
            name: "Upcoming Events",
            value: "Check Calendar",
            icon: Calendar,
            href: "/dashboard/calendar",
            color: "text-amber-500",
            bg: "bg-amber-500/10",
        },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight font-heading">Dashboard</h2>
                    <p className="text-muted-foreground">Overview of your client management activities.</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {stats.map((stat) => (
                    <div
                        key={stat.name}
                        className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {stat.name}
                                </p>
                                <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                            </div>
                            <div className={`${stat.bg} p-3 rounded-lg`}>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                        </div>
                        <Link
                            href={stat.href}
                            className="absolute inset-0 z-10 flex items-end justify-end p-4 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                            <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                        </Link>
                    </div>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 rounded-xl border bg-card p-6 shadow-sm">
                    <h3 className="font-semibold mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/dashboard/clients" className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-accent transition-colors gap-2 text-center">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400">
                                <Users className="h-6 w-6" />
                            </div>
                            <span className="font-medium">Manage Clients</span>
                        </Link>
                        <Link href="/dashboard/email" className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-accent transition-colors gap-2 text-center">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full text-purple-600 dark:text-purple-400">
                                <Mail className="h-6 w-6" />
                            </div>
                            <span className="font-medium">Send Email</span>
                        </Link>
                    </div>
                </div>
                <div className="col-span-3 rounded-xl border bg-card p-6 shadow-sm">
                    <h3 className="font-semibold mb-4">Recent Activity</h3>
                    <div className="text-sm text-muted-foreground text-center py-8">
                        No recent activity recorded.
                    </div>
                </div>
            </div>
        </div>
    );
}
