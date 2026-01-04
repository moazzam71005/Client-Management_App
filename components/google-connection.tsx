"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, XCircle, Link2, Unlink } from "lucide-react";

export function GoogleConnection() {
    const [connected, setConnected] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);
    const [connecting, setConnecting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        checkConnection();
    }, []);

    const checkConnection = async () => {
        try {
            const response = await fetch("/api/google/status");
            if (response.ok) {
                const data = await response.json();
                setConnected(data.connected);
            }
        } catch (error) {
            console.error("Error checking Google connection:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async () => {
        setConnecting(true);
        try {
            const response = await fetch("/api/google/connect");
            if (response.redirected) {
                window.location.href = response.url;
            }
        } catch (error) {
            console.error("Error connecting Google:", error);
            setConnecting(false);
        }
    };

    const handleDisconnect = async () => {
        if (!confirm("Are you sure you want to disconnect your Google account? You won't be able to sync calendar or send emails.")) {
            return;
        }

        setConnecting(true);
        try {
            const response = await fetch("/api/google/disconnect", {
                method: "POST",
            });
            if (response.ok) {
                setConnected(false);
                router.refresh();
            }
        } catch (error) {
            console.error("Error disconnecting Google:", error);
        } finally {
            setConnecting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Checking connection...</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            {connected ? (
                <>
                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Google Connected</span>
                    </div>
                    <button
                        onClick={handleDisconnect}
                        disabled={connecting}
                        className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent disabled:opacity-50 transition-colors"
                    >
                        {connecting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                <Unlink className="h-4 w-4" />
                                <span>Disconnect</span>
                            </>
                        )}
                    </button>
                </>
            ) : (
                <button
                    onClick={handleConnect}
                    disabled={connecting}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                    {connecting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <>
                            <Link2 className="h-4 w-4" />
                            <span>Connect Google</span>
                        </>
                    )}
                </button>
            )}
        </div>
    );
}

