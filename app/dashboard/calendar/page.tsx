"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    format,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
} from "date-fns";
import { Calendar as CalendarIcon, RefreshCw, Clock, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

// Define Event type based on Google API response structure (subset)
interface CalendarEvent {
    id: string;
    summary: string;
    description?: string;
    start: { dateTime?: string; date?: string };
    end: { dateTime?: string; date?: string };
    htmlLink: string;
}

export default function CalendarPage() {
    const [filter, setFilter] = useState<"today" | "week" | "month">("week");

    const {
        data: events,
        isLoading,
        isError,
        refetch,
        isRefetching,
    } = useQuery<CalendarEvent[]>({
        queryKey: ["calendar-events", filter],
        queryFn: async () => {
            let timeMin = new Date().toISOString();
            let timeMax = undefined;

            const now = new Date();
            if (filter === "today") {
                timeMin = new Date(now.setHours(0, 0, 0, 0)).toISOString();
                timeMax = new Date(now.setHours(23, 59, 59, 999)).toISOString();
            } else if (filter === "week") {
                timeMin = startOfWeek(now).toISOString();
                timeMax = endOfWeek(now).toISOString();
            } else if (filter === "month") {
                timeMin = startOfMonth(now).toISOString();
                timeMax = endOfMonth(now).toISOString();
            }

            const params = new URLSearchParams();
            if (timeMin) params.append("timeMin", timeMin);
            if (timeMax) params.append("timeMax", timeMax);

            const res = await fetch(`/api/calendar/events?${params.toString()}`);
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                if (res.status === 403 && data.error?.includes('Google connection')) {
                    throw new Error("GOOGLE_NOT_CONNECTED");
                }
                if (res.status === 401) throw new Error("Auth Error");
                throw new Error(data.error || "Failed to fetch events");
            }
            return res.json();
        },
    });

    // Group events by date for display
    const groupedEvents = events?.reduce((acc, event) => {
        const date = event.start.dateTime || event.start.date;
        if (!date) return acc;
        const dateStr = format(new Date(date), "yyyy-MM-dd");
        if (!acc[dateStr]) acc[dateStr] = [];
        acc[dateStr].push(event);
        return acc;
    }, {} as Record<string, CalendarEvent[]>);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-heading">Calendar</h1>
                    <p className="text-muted-foreground">
                        Stay on top of your schedule with Google Sync.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex rounded-lg border bg-muted p-1">
                        {(["today", "week", "month"] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={cn(
                                    "px-3 py-1.5 text-sm font-medium rounded-md transition-all capitalize",
                                    filter === f
                                        ? "bg-background text-foreground shadow-sm"
                                        : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                                )}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => refetch()}
                        className={cn(
                            "inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-background shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                            isRefetching && "animate-spin text-primary"
                        )}
                        title="Refresh"
                    >
                        <RefreshCw className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex h-[400px] items-center justify-center rounded-xl border border-dashed bg-card/50">
                    <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p className="text-sm text-muted-foreground">Syncing with Google Calendar...</p>
                    </div>
                </div>
            ) : isError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-900 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-200">
                    <p className="font-medium">Connection Error</p>
                    <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                        {isError && (isError as Error).message === "GOOGLE_NOT_CONNECTED"
                            ? "Please connect your Google account in the header to sync your calendar."
                            : "Could not sync with Google Calendar. Please check your connection."}
                    </p>
                </div>
            ) : !groupedEvents || Object.keys(groupedEvents).length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card py-12 text-center">
                    <div className="rounded-full bg-muted p-3">
                        <CalendarIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">No events found</h3>
                    <p className="text-sm text-muted-foreground">
                        No events scheduled for this {filter}.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(groupedEvents)
                        .sort()
                        .map(([date, dayEvents]) => (
                            <div
                                key={date}
                                className="overflow-hidden rounded-xl border bg-card shadow-sm"
                            >
                                <div className="border-b bg-muted/40 px-6 py-3">
                                    <h3 className="font-semibold text-foreground">
                                        {format(new Date(date), "EEEE, MMMM d, yyyy")}
                                    </h3>
                                </div>
                                <div className="divide-y divide-border">
                                    {dayEvents.map((event) => (
                                        <div
                                            key={event.id}
                                            className="group flex flex-col gap-3 p-4 transition-colors hover:bg-muted/30 sm:flex-row sm:items-start"
                                        >
                                            <div className="flex min-w-[80px] shrink-0 items-center text-sm text-muted-foreground">
                                                <Clock className="mr-2 h-4 w-4" />
                                                {event.start.dateTime
                                                    ? format(new Date(event.start.dateTime), "HH:mm")
                                                    : "All Day"}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <h4 className="font-medium leading-none text-foreground">
                                                    {event.summary}
                                                </h4>
                                                {event.description && (
                                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                                        {event.description}
                                                    </p>
                                                )}
                                            </div>
                                            <a
                                                href={event.htmlLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="invisible flex items-center gap-1 text-xs font-medium text-primary hover:underline group-hover:visible"
                                            >
                                                Open <ExternalLink className="h-3 w-3" />
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}
