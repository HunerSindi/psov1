"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCompanies, createCompany, updateCompany, deleteCompany, payCompany, Company } from "@/lib/api/companies";
import { Printer, Plus } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext"; // Hook

// Components
import CompanyHeader from "./components/CompanyHeader";
import CompanyFilter from "./components/CompanyFilter";
import CompanyTable from "./components/CompanyTable";
import CompanyFormDialog from "./components/CompanyFormDialog";
import CompanyPayDialog from "./components/CompanyPayDialog";
import PrintCompanyList from "./components/PrintCompanyList";

export default function CompanyPage() {
    const router = useRouter();
    const { t } = useSettings(); // Hook

    // Auth State
    const [user, setUser] = useState<any>(null);
    const [mounted, setMounted] = useState(false);

    // Data State
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter/Page State
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 15;

    // Modals
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isPayOpen, setIsPayOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

    // 1. Auth Check
    useEffect(() => {
        const stored = localStorage.getItem("pos_user");
        if (!stored) {
            router.push("/login");
        } else {
            setUser(JSON.parse(stored));
        }
        setMounted(true);
    }, [router]);

    // 2. Load Data
    useEffect(() => {
        if (mounted) loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, status, page, mounted]);

    const loadData = async () => {
        setLoading(true);
        const res = await getCompanies(search, page, limit, status);
        if (res) {
            setCompanies(res.data);
            setTotalPages(Math.ceil(res.meta.total / res.meta.limit));
        }
        setLoading(false);
    };

    if (!mounted || !user) return null;

    // --- Permissions ---
    const perms = user.permissions || [];
    const isAdmin = perms.includes("admin");

    const canAdd = isAdmin || perms.includes("add-company");
    const canEdit = isAdmin || perms.includes("edit-company");
    const canDelete = isAdmin || perms.includes("delete-company");
    const canPay = isAdmin || perms.includes("pay-company");

    // --- Handlers ---

    const handleDelete = async (id: number) => {
        // Translated Confirm
        if (confirm(t("company.dialogs.delete_confirm"))) {
            await deleteCompany(id);
            loadData();
        }
    };

    const handleFormSubmit = async (data: Company) => {
        if (selectedCompany && selectedCompany.id) {
            await updateCompany(selectedCompany.id, data);
        } else {
            await createCompany(data);
        }
        setIsFormOpen(false);
        loadData();
    };

    const handlePaySubmit = async (amount: number, desc: string) => {
        if (selectedCompany && selectedCompany.id) {
            await payCompany(selectedCompany.id, amount, desc);
            setIsPayOpen(false);
            loadData();
        }
    }

    return (
        <div className="h-screen flex flex-col bg-white font-sans overflow-hidden">
            <div className="print:hidden"><CompanyHeader /></div>

            <div className="flex-1 flex overflow-hidden p-2 gap-2 print:hidden">
                <div className="flex-[4] flex flex-col h-full overflow-hidden">
                    <CompanyFilter search={search} onSearchChange={setSearch} status={status} onStatusChange={setStatus} />

                    <div className="flex-1 overflow-hidden mt-2">
                        <CompanyTable
                            companies={companies}
                            loading={loading}
                            page={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                            onEdit={(c) => { setSelectedCompany(c); setIsFormOpen(true); }}
                            onDelete={handleDelete}
                            onPay={(c) => { setSelectedCompany(c); setIsPayOpen(true); }}
                            permissions={{ canEdit, canDelete, canPay }}
                        />
                    </div>
                </div>

                <div className="flex-1 bg-white border border-gray-400 p-2 flex flex-col gap-4 h-fit">
                    <div className="bg-gray-50 border border-gray-200 p-3 text-center">
                        <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">
                            {t("company.actions.sidebar_title")}
                        </h3>

                        {canAdd && (
                            <button
                                onClick={() => { setSelectedCompany(null); setIsFormOpen(true); }}
                                className="w-full flex items-center justify-center gap-2 bg-blue-700 text-white py-3 font-bold hover:bg-blue-800 border border-blue-900 transition-colors mb-2"
                            >
                                <Plus size={18} />
                                {t("company.actions.add_company")}
                            </button>
                        )}

                        <button
                            onClick={() => window.print()}
                            className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 font-bold hover:bg-gray-800 border border-black transition-colors"
                        >
                            <Printer size={18} />
                            {t("company.actions.print_list")}
                        </button>
                    </div>
                </div>
            </div>

            {/* Dialogs */}
            <CompanyFormDialog
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={selectedCompany}
                isEditing={!!selectedCompany?.id}
            />

            <CompanyPayDialog
                isOpen={isPayOpen}
                onClose={() => setIsPayOpen(false)}
                onSubmit={handlePaySubmit}
                company={selectedCompany}
            />

            <PrintCompanyList companies={companies} />
        </div>
    );
}