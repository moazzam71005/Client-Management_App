"use client";

import { useState } from "react";
import { useClients } from "@/hooks/use-clients";
import { useTemplates } from "@/hooks/use-templates";
import { Send, CheckCircle, AlertCircle, FileText, Search, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EmailPage() {
    const { clients } = useClients();
    const { templates } = useTemplates();
    const [selectedClientIds, setSelectedClientIds] = useState<Set<string>>(
        new Set()
    );
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [sending, setSending] = useState(false);
    const [results, setResults] = useState<any[] | null>(null);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState("");

    const handleSelectAll = (checked: boolean) => {
        if (checked && clients) {
            setSelectedClientIds(new Set(clients.map((c) => c.id)));
        } else {
            setSelectedClientIds(new Set());
        }
    };

    const toggleClient = (id: string) => {
        const newSet = new Set(selectedClientIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedClientIds(newSet);
    };

    const applyTemplate = (templateId: string) => {
        setSelectedTemplateId(templateId);
        if (!templateId) return;

        const template = templates?.find((t) => t.id === templateId);
        if (template) {
            setSubject(template.subject);
            setBody(template.body);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedClientIds.size === 0) {
            alert("Please select at least one client.");
            return;
        }

        setSending(true);
        setResults(null);

        const recipients =
            clients
                ?.filter((c) => selectedClientIds.has(c.id))
                .map((c) => c.email) || [];

        try {
            const res = await fetch("/api/email/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    recipients,
                    subject,
                    body,
                }),
            });
            const data = await res.json();
            
            if (!res.ok && res.status === 403 && data.error?.includes('Google connection')) {
                alert("Please connect your Google account in the header to send emails.");
                setSending(false);
                return;
            }
            
            setResults(data);
            if (res.ok) {
                setSubject("");
                setBody("");
                setSelectedClientIds(new Set());
                setSelectedTemplateId("");
            }
        } catch (error) {
            console.error(error);
            alert("Failed to send emails");
        } finally {
            setSending(false);
        }
    };

    const filteredClients = clients?.filter(
        (c) =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-[calc(100vh-8rem)] min-h-[600px] gap-6 grid lg:grid-cols-3">
            {/* Client Selection (Left Column) */}
            <div className="lg:col-span-1 flex flex-col rounded-xl border bg-card shadow-sm overflow-hidden">
                <div className="border-b bg-muted/40 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-foreground">Recipients</h2>
                        <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                            {selectedClientIds.size} selected
                        </div>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 pl-9 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="select-all"
                            className="h-4 w-4 rounded border-primary text-primary focus:ring-primary"
                            checked={
                                clients?.length !== 0 &&
                                selectedClientIds.size === clients?.length
                            }
                            onChange={(e) => handleSelectAll(e.target.checked)}
                        />
                        <label
                            htmlFor="select-all"
                            className="text-xs font-medium text-muted-foreground cursor-pointer select-none"
                        >
                            Select All Clients
                        </label>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    {!filteredClients || filteredClients.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-8">
                            <User className="h-8 w-8 text-muted-foreground/50 mb-2" />
                            <p className="text-sm text-muted-foreground">No clients found.</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {filteredClients.map((client) => (
                                <div
                                    key={client.id}
                                    className={cn(
                                        "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border",
                                        selectedClientIds.has(client.id)
                                            ? "bg-primary/5 border-primary/20"
                                            : "hover:bg-muted/50 border-transparent bg-transparent"
                                    )}
                                    onClick={() => toggleClient(client.id)}
                                >
                                    <div className={cn(
                                        "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                                        selectedClientIds.has(client.id) ? "bg-primary text-primary-foreground border-primary" : "border-input bg-background"
                                    )}>
                                        {selectedClientIds.has(client.id) && <div className="h-2.5 w-2.5 bg-current rounded-[1px]" />}
                                    </div>

                                    <div className="flex-1 overflow-hidden">
                                        <p className={cn("text-sm font-medium", selectedClientIds.has(client.id) ? "text-primary" : "text-foreground")}>
                                            {client.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {client.email}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Email Composition (Right Column) */}
            <div className="lg:col-span-2 flex flex-col rounded-xl border bg-card shadow-sm overflow-hidden">
                <div className="border-b bg-muted/40 px-6 py-4 flex items-center justify-between">
                    <h2 className="font-semibold text-foreground">Compose</h2>
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <select
                            className="h-8 rounded-md border border-input bg-transparent px-2 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            value={selectedTemplateId}
                            onChange={(e) => applyTemplate(e.target.value)}
                        >
                            <option value="" className="text-muted-foreground">Load Template...</option>
                            {templates?.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex-1 p-6 flex flex-col">
                    {results && (
                        <div
                            className={cn(
                                "mb-6 p-4 rounded-lg flex items-start gap-3 border",
                                results.some((r) => r.status === "error")
                                    ? "bg-red-50 text-red-900 border-red-100 dark:bg-red-900/20 dark:text-red-200 dark:border-red-900/50"
                                    : "bg-green-50 text-green-900 border-green-100 dark:bg-green-900/20 dark:text-green-200 dark:border-green-900/50"
                            )}
                        >
                            {results.some((r) => r.status === "error") ? (
                                <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                            ) : (
                                <CheckCircle className="h-5 w-5 mt-0.5 shrink-0" />
                            )}
                            <div>
                                <p className="font-semibold">Sending Complete</p>
                                <ul className="text-xs mt-1 space-y-1 opacity-90">
                                    <li>
                                        Success: {results.filter((r) => r.status === "success").length}
                                    </li>
                                    <li>
                                        Failed: {results.filter((r) => r.status === "error").length}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSend} className="flex-1 flex flex-col gap-4">
                        <div>
                            <input
                                type="text"
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Subject line"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />
                        </div>

                        <div className="flex-1">
                            <textarea
                                required
                                className="flex min-h-[300px] w-full h-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none font-mono"
                                placeholder="Type your message..."
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                            />
                            <div className="mt-2 text-xs text-muted-foreground">
                                Supported variables: {"{{client_name}}"}, {"{{email}}"}
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={sending || selectedClientIds.size === 0}
                                className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-2.5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 min-w-[140px]"
                            >
                                {sending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Send to {selectedClientIds.size} {selectedClientIds.size === 1 ? 'recipient' : 'recipients'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
