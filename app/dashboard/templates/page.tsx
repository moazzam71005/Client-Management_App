"use client";

import { useState } from "react";
import { useTemplates } from "@/hooks/use-templates";
import { EmailTemplate } from "@/types";
import { TemplateForm } from "@/components/template-form";
import { Plus, Pencil, Trash2, FileText } from "lucide-react";
import { format } from "date-fns";

export default function TemplatesPage() {
    const { templates, isLoading, isError, createTemplate, updateTemplate, deleteTemplate } = useTemplates();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | undefined>(undefined);

    const handleCreate = async (data: any) => {
        await createTemplate(data);
    };

    const handleUpdate = async (data: any) => {
        if (editingTemplate) {
            await updateTemplate({ id: editingTemplate.id, data });
        }
    };

    const openCreate = () => {
        setEditingTemplate(undefined);
        setIsFormOpen(true);
    };

    const openEdit = (template: EmailTemplate) => {
        setEditingTemplate(template);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this template?")) {
            await deleteTemplate(id);
        }
    };

    if (isLoading)
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );

    if (isError)
        return <div className="p-8 text-destructive">Error loading templates</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-heading">Templates</h1>
                    <p className="text-muted-foreground">Manage your email templates.</p>
                </div>
                <button
                    onClick={openCreate}
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    New Template
                </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {!templates || templates.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed bg-card py-12 text-center text-muted-foreground">
                        <FileText className="h-8 w-8 mb-3 opacity-50" />
                        <p>No templates yet. Create your first one.</p>
                    </div>
                ) : (
                    templates.map((template) => (
                        <div
                            key={template.id}
                            className="group relative flex flex-col justify-between rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md"
                        >
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold leading-none tracking-tight">
                                        {template.name}
                                    </h3>
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground">Subject:</p>
                                    <p className="text-sm text-foreground line-clamp-1">{template.subject}</p>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-3 bg-muted/50 p-2 rounded-md font-mono">
                                    {template.body}
                                </p>
                            </div>
                            <div className="mt-4 flex items-center justify-end gap-2 pt-4 border-t">
                                <div className="text-xs text-muted-foreground mr-auto">
                                    {template.updated_at ? format(new Date(template.updated_at), 'MMM d, yyyy') : ''}
                                </div>
                                <button
                                    onClick={() => openEdit(template)}
                                    className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                >
                                    <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(template.id)}
                                    className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <TemplateForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={editingTemplate ? handleUpdate : handleCreate}
                template={editingTemplate}
            />
        </div>
    );
}
