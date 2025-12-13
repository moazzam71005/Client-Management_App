"use client";

import { useState, useEffect } from "react";
import { EmailTemplate } from "@/types";
import { X, Loader2 } from "lucide-react";

interface TemplateFormProps {
    template?: EmailTemplate;
    onSubmit: (data: { name: string; subject: string; body: string }) => Promise<void>;
    onClose: () => void;
    isOpen: boolean;
}

export function TemplateForm({
    template,
    onSubmit,
    onClose,
    isOpen,
}: TemplateFormProps) {
    const [formData, setFormData] = useState({
        name: "",
        subject: "",
        body: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (template) {
            setFormData({
                name: template.name,
                subject: template.subject,
                body: template.body,
            });
        } else {
            setFormData({ name: "", subject: "", body: "" });
        }
    }, [template, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await onSubmit(formData);
            onClose();
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-xl bg-background p-0 shadow-2xl border dark:border-zinc-800">
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <h2 className="text-lg font-semibold">
                        {template ? "Edit Template" : "New Template"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {error && (
                    <div className="m-6 mb-0 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Template Name</label>
                        <input
                            type="text"
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="e.g. Weekly Update"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Default Subject</label>
                        <input
                            type="text"
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Subject line"
                            value={formData.subject}
                            onChange={(e) =>
                                setFormData({ ...formData, subject: e.target.value })
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Body Message</label>
                        <textarea
                            required
                            className="flex min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                            placeholder="Message content..."
                            value={formData.body}
                            onChange={(e) =>
                                setFormData({ ...formData, body: e.target.value })
                            }
                        />
                        <p className="text-xs text-muted-foreground">Supported vars: {"{{client_name}}"}, {"{{email}}"}, {"{{date}}"}</p>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 min-w-[100px]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving
                                </>
                            ) : (
                                "Save Template"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
