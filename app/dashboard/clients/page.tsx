"use client";

import { useState } from "react";
import { useClients } from "@/hooks/use-clients";
import { ClientForm } from "@/components/client-form";
import { Client } from "@/types";
import { Plus, Pencil, Trash2, Search, MoreHorizontal, User } from "lucide-react";

export default function ClientsPage() {
    const { clients, isLoading, isError, createClient, updateClient, deleteClient } =
        useClients();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | undefined>(
        undefined
    );
    const [searchTerm, setSearchTerm] = useState("");

    const handleCreate = async (data: any) => {
        await createClient(data);
    };

    const handleUpdate = async (data: any) => {
        if (editingClient) {
            await updateClient({ id: editingClient.id, data });
        }
    };

    const openCreate = () => {
        setEditingClient(undefined);
        setIsFormOpen(true);
    };

    const openEdit = (client: Client) => {
        setEditingClient(client);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this client?")) {
            await deleteClient(id);
        }
    };

    const filteredClients = clients?.filter(
        (client) =>
            client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading)
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );

    if (isError)
        return (
            <div className="p-8 text-destructive bg-destructive/10 rounded-lg">
                Error loading clients. Please try refreshing.
            </div>
        );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-heading">Clients</h1>
                    <p className="text-muted-foreground">
                        Manage and organize your client base.
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Client
                </button>
            </div>

            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search clients..."
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b bg-muted/50">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                                    Name
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                                    Email
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                                    Phone
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {filteredClients?.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="h-24 text-center">
                                        <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                                            <User className="h-8 w-8 mb-2 opacity-50" />
                                            No clients found.
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredClients?.map((client) => (
                                    <tr
                                        key={client.id}
                                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                    >
                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 font-medium">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                                                    {client.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{client.name}</div>
                                                    {client.notes && <div className="text-xs text-muted-foreground truncate max-w-[200px]">{client.notes}</div>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-muted-foreground">
                                            {client.email}
                                        </td>
                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-muted-foreground">
                                            {client.phone || '-'}
                                        </td>
                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEdit(client)}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                                    title="Edit"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(client.id)}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm font-medium shadow-sm transition-colors hover:bg-destructive hover:text-destructive-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-destructive"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ClientForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={editingClient ? handleUpdate : handleCreate}
                client={editingClient}
            />
        </div>
    );
}
