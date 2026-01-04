import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { getAuthenticatedUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getAuthenticatedUser();
    
    if (!user) {
        redirect('/login');
    }

    return (
        <div className="flex min-h-screen bg-muted/40 font-sans">
            <Sidebar />
            <div className="flex flex-1 flex-col">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
