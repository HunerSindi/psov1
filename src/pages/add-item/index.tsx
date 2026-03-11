"use client";

import { useEffect, useState } from "react";
import { getCompanies, Company } from "@/lib/api/companies";
import { getReceipts, createReceipt, Receipt, PaginationMeta } from "@/lib/api/receipts";
import SaleHeader from "./components/SaleHeader";
import CompanySection from "./components/CompanySection";
import ReceiptList from "./components/ReceiptList";

export default function SalePage() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [meta, setMeta] = useState<PaginationMeta>({
        current_page: 1,
        per_page: 20,
        total_items: 0,
        total_pages: 1
    });
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        const fetchCompanies = async () => {
            const res = await getCompanies("", 1, 100);
            if (res && res.data) {
                setCompanies(res.data);
            }
        };
        fetchCompanies();
    }, []);

    useEffect(() => {
        const id = selectedCompany ? selectedCompany.id : undefined;
        loadReceipts(id, 1);
    }, [selectedCompany]);

    const loadReceipts = async (companyId?: number, page: number = 1) => {
        setIsTableLoading(true);
        const res = await getReceipts(companyId, page);
        if (res.status === "success") {
            setReceipts(res.data);
            setMeta(res.meta);
        } else {
            setReceipts([]);
            setMeta({ current_page: 1, per_page: 20, total_items: 0, total_pages: 1 });
        }
        setIsTableLoading(false);
    };

    const handlePageChange = (newPage: number) => {
        const id = selectedCompany ? selectedCompany.id : undefined;
        loadReceipts(id, newPage);
    };

    const handleCreate = async (paymentType: string, amount: number) => {
        if (!selectedCompany || !selectedCompany.id) return;
        setIsCreating(true);
        const userStr = localStorage.getItem("pos_user");
        const userId = userStr ? JSON.parse(userStr).id : 1;

        const success = await createReceipt({
            company_id: selectedCompany.id,
            user_id: userId,
            payment_type: paymentType,
            paid_amount: amount
        });

        if (success) {
            loadReceipts(selectedCompany.id, 1);
        } else {
            alert("Failed to create receipt");
        }
        setIsCreating(false);
    };

    return (
        <div className="h-screen flex flex-col font-sans bg-gray-100 overflow-hidden">
            <SaleHeader />

            {/* Main Container - Fixed Height calculated based on Header */}
            <div className="flex-1 flex flex-col p-3 mx-auto w-full gap-2 min-h-0">

                {/* SECTION 1: Company Selector (Fixed Height) */}
                <div className="shrink-0">
                    <CompanySection
                        companies={companies}
                        selectedCompany={selectedCompany}
                        onSelectCompany={setSelectedCompany}
                        onCreateReceipt={handleCreate}
                        loading={isCreating}
                    />
                </div>

                {/* SECTION 2: Receipt List (Takes Remaining Space) */}
                {/* min-h-0 is CRITICAL here for inner scrolling */}
                <div className="flex-1 min-h-0">
                    <ReceiptList
                        receipts={receipts}
                        meta={meta}
                        loading={isTableLoading}
                        title={selectedCompany ? `${selectedCompany.name} Receipts` : "All Receipts"}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    );
}