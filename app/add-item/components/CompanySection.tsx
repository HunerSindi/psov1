"use client";

import React, { useState } from "react";
import { Company } from "@/lib/api/companies";
import { Search, Building2, Check } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Props {
    companies: Company[];
    selectedCompany: Company | null;
    onSelectCompany: (company: Company | null) => void;
    onCreateReceipt: (paymentType: string, amount: number) => Promise<void>;
    loading: boolean;
}

export default function CompanySection({
    companies,
    selectedCompany,
    onSelectCompany,
    onCreateReceipt,
    loading,
}: Props) {
    const { t, dir } = useSettings();

    // Dialog State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Form State
    const [paymentType, setPaymentType] = useState("cash");
    const [paidAmount, setPaidAmount] = useState<string>(""); // FIX: Use string to allow "0" check properly

    // Filter Companies
    const filteredCompanies = companies.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (company: Company) => {
        onSelectCompany(company);
        setIsDialogOpen(false);
        setSearchTerm("");
    };

    const handleSubmit = async () => {
        // FIX: Allow if string is not empty (so "0" is valid)
        if (!selectedCompany || paidAmount === "") return;

        await onCreateReceipt(paymentType, Number(paidAmount));
        setPaidAmount("");
    };

    return (
        <div className="bg-gray-100 border border-gray-400 p-2 shadow-sm">
            {/* MAIN TOOLBAR ROW */}
            <div className="flex flex-row flex-wrap items-center justify-between gap-2">

                {/* LEFT: Company Selection */}
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-600 uppercase">
                        {t("add_item.company_label")}:
                    </span>

                    {selectedCompany ? (
                        <div className="flex items-center gap-2 bg-yellow-50 border border-gray-400 px-2 h-8 min-w-[150px]">
                            <Building2 className="text-gray-600" size={14} />
                            <span className="text-sm font-bold text-black truncate max-w-[200px]">
                                {selectedCompany.name}
                            </span>
                            <button
                                onClick={() => onSelectCompany(null)}
                                className="ml-auto text-xs text-red-600 hover:bg-red-100 px-1 font-bold"
                                title="Clear Selection"
                            >
                                X
                            </button>
                        </div>
                    ) : (
                        <div className="h-8 px-2 border border-gray-300 bg-gray-50 flex items-center min-w-[150px]">
                            <span className="text-xs text-gray-400 italic">
                                {t("add_item.no_company")}
                            </span>
                        </div>
                    )}

                    <button
                        onClick={() => setIsDialogOpen(true)}
                        className="h-8 px-3 text-xs font-bold uppercase bg-white border border-gray-400 text-gray-800 hover:bg-gray-50 active:translate-y-px transition-all"
                    >
                        {selectedCompany ? t("add_item.change_btn") : t("add_item.select_btn")}
                    </button>
                </div>

                {/* RIGHT: Inputs & Actions */}
                {selectedCompany && (
                    <div className={`flex flex-1 items-center justify-end gap-2 pl-2 ${dir === 'rtl' ? 'border-r border-gray-300 pr-2' : 'border-l border-gray-300 pl-2'}`}>

                        {/* Amount Input */}
                        <div className="flex flex-col md:flex-row md:items-center gap-1">
                            <label className="text-[10px] font-bold text-gray-600 uppercase">
                                {t("add_item.amount_label")}
                            </label>
                            <input
                                type="number"
                                placeholder="0.00"
                                className="w-28 h-8 border border-gray-400 px-2 text-sm text-right font-mono focus:border-blue-600 focus:outline-none rounded-none"
                                value={paidAmount}
                                // FIX: Store as string to differentiate between "" (empty) and "0"
                                onChange={(e) => setPaidAmount(e.target.value)}
                                onFocus={(e) => e.target.select()}
                            />
                        </div>

                        {/* Type Select */}
                        <div className="flex flex-col md:flex-row md:items-center gap-1">
                            <label className="text-[10px] font-bold text-gray-600 uppercase">
                                {t("add_item.type_label")}
                            </label>
                            <select
                                className="h-8 border border-gray-400 px-1 text-sm bg-white focus:border-blue-600 focus:outline-none rounded-none w-24"
                                value={paymentType}
                                onChange={(e) => setPaymentType(e.target.value)}
                            >
                                <option value="cash">{t("add_item.cash")}</option>
                                <option value="loan">{t("add_item.loan")}</option>
                            </select>
                        </div>

                        {/* Confirm Button */}
                        <div className="flex flex-col justify-end h-full pt-4 md:pt-0">
                            <button
                                onClick={handleSubmit}
                                // FIX: Only disable if empty string (allow "0")
                                disabled={loading || paidAmount === ""}
                                className={`h-8 px-5 text-xs font-bold uppercase border transition-colors ${loading || paidAmount === ""
                                    ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                                    : "bg-blue-700 text-white border-blue-800 hover:bg-blue-800"
                                    }`}
                            >
                                {loading ? t("add_item.saving") : t("add_item.add_record_btn")}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* --- SEARCH DIALOG (Same as before) --- */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-white max-w-md flex flex-col p-0 gap-0 border-2 border-gray-600 rounded-none shadow-none" dir={dir}>
                    <DialogHeader className="p-2 bg-blue-700 border-b border-blue-800">
                        <DialogTitle className="text-sm font-bold text-white uppercase tracking-wide">
                            {t("add_item.find_company")}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="p-2 border-b border-gray-300 bg-gray-50">
                        <div className="relative">
                            <Search className={`absolute top-1/2 -translate-y-1/2 text-gray-500 ${dir === 'rtl' ? 'right-2' : 'left-2'}`} size={14} />
                            <input
                                autoFocus
                                type="text"
                                placeholder={t("add_item.filter_placeholder")}
                                className={`w-full py-1 text-sm border border-gray-400 focus:outline-none focus:border-blue-600 rounded-none ${dir === 'rtl' ? 'pr-8 pl-3' : 'pl-8 pr-3'}`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="h-64 overflow-y-auto bg-white p-1">
                        {filteredCompanies.length === 0 ? (
                            <div className="p-4 text-center text-xs text-gray-500 italic">
                                {t("add_item.no_results")}
                            </div>
                        ) : (
                            filteredCompanies.map((c) => (
                                <button
                                    key={c.id}
                                    onClick={() => handleSelect(c)}
                                    className={`w-full text-left px-3 py-2 text-sm border-b border-gray-100 hover:bg-yellow-50 flex justify-between items-center group ${selectedCompany?.id === c.id ? "bg-blue-50 font-bold" : "text-gray-800"
                                        }`}
                                >
                                    <span>{c.name}</span>
                                    {selectedCompany?.id === c.id && (
                                        <Check size={14} className="text-blue-700" />
                                    )}
                                </button>
                            ))
                        )}
                    </div>

                    <div className={`p-2 bg-gray-100 border-t border-gray-300 ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>
                        <button
                            onClick={() => setIsDialogOpen(false)}
                            className="px-3 py-1 bg-white border border-gray-400 text-xs font-bold uppercase hover:bg-gray-200"
                        >
                            {t("add_item.cancel")}
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}