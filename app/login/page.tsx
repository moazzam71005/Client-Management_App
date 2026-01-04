"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSignUp, setIsSignUp] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isSignUp) {
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${location.origin}/auth/callback`,
                    },
                });
                if (signUpError) throw signUpError;
                alert("Check your email to confirm your account!");
            } else {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (signInError) throw signInError;
                router.push("/dashboard");
                router.refresh();
            }
        } catch (error: any) {
            console.error("Error logging in:", error);
            setError(error.message || "Error logging in");
        } finally {
            setLoading(false);
        }
    };

    const handleMagicLink = async () => {
        setError(null);
        setLoading(true);

        try {
            const { error: magicLinkError } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${location.origin}/auth/callback`,
                },
            });
            if (magicLinkError) throw magicLinkError;
            alert("Check your email for the magic link!");
        } catch (error: any) {
            console.error("Error sending magic link:", error);
            setError(error.message || "Error sending magic link");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full">
            {/* Left Side - Hero/Visual */}
            <div className="hidden w-1/2 flex-col justify-between bg-zinc-900 p-12 text-white lg:flex relative overflow-hidden">

                {/* Abstract Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-20" />
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

                <div className="relative z-10 flex items-center gap-2 font-bold text-xl">
                    <div className="size-8 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm">
                        <span>CS</span>
                    </div>
                    ClientStream
                </div>

                <div className="relative z-10 space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight font-heading">
                        Manage your clients with <br /> style and efficiency.
                    </h1>
                    <p className="text-lg text-zinc-300">
                        Seamlessly sync with Google Calendar and Gmail to keep your business moving forward.
                    </p>
                </div>

                <div className="relative z-10 text-sm text-zinc-400">
                    © 2025 ClientStream Inc.
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex w-full items-center justify-center lg:w-1/2 bg-background">
                <div className="w-full max-w-md space-y-8 px-8">
                    <div className="space-y-2 text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground font-heading">Welcome back</h2>
                        <p className="text-sm text-muted-foreground">
                            Sign in to access your dashboard
                        </p>
                    </div>

                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        {error && (
                            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-600 dark:text-red-400">
                                {error}
                            </div>
                        )}
                        
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-foreground">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                placeholder="you@example.com"
                            />
                        </div>

                        {!isSignUp && (
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium text-foreground">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    placeholder="••••••••"
                                />
                            </div>
                        )}

                        {isSignUp && (
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium text-foreground">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    placeholder="••••••••"
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 transition-all"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin size-5" />
                            ) : (
                                <span>{isSignUp ? "Sign Up" : "Sign In"}</span>
                            )}
                        </button>

                        {!isSignUp && (
                            <button
                                type="button"
                                onClick={handleMagicLink}
                                disabled={loading || !email}
                                className="w-full flex items-center justify-center gap-2 rounded-xl border border-input bg-background px-4 py-3 text-sm font-semibold text-foreground shadow-sm hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50 transition-all"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin size-5" />
                                ) : (
                                    <span>Send Magic Link</span>
                                )}
                            </button>
                        )}

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsSignUp(!isSignUp);
                                    setError(null);
                                }}
                                className="text-sm text-muted-foreground hover:text-foreground underline"
                            >
                                {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
