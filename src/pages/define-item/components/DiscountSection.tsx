"use client";

import React from "react";
import { Percent, Save } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext";

type TabId = "barcode" | "discounts";

interface Props {
    discountType: string;
    discountValue: number;
    discountStartDate: string;
    discountEndDate: string;
    onChange: (field: "discount_type" | "discount_value" | "discount_start_date" | "discount_end_date", value: string | number) => void;
    loading: boolean;
    onSave: () => void;
    isUpdateMode: boolean;
    name: string;
    activeTab: TabId;
    onTabChange: (tab: TabId) => void;
}

export default function DiscountSection({
    discountType,
    discountValue,
    discountStartDate,
    discountEndDate,
    onChange,
    loading,
    onSave,
    isUpdateMode,
    name,
    activeTab,
    onTabChange,
}: Props) {
    const { t } = useSettings();

    return (
        <div className="bg-white border border-gray-400 flex flex-col h-[calc(100vh-76px)]">
            <div className="flex border-b border-gray-400 bg-gray-100 shrink-0">
                <button
                    type="button"
                    onClick={() => onTabChange("barcode")}
                    className={`px-4 py-2 text-xs font-bold uppercase border-b-2 transition-colors ${
                        activeTab === "barcode"
                            ? "border-blue-600 text-blue-700 bg-white -mb-px"
                            : "border-transparent text-gray-600 hover:text-gray-800"
                    }`}
                >
                    {t("define_item.tab_barcode")}
                </button>
                <button
                    type="button"
                    onClick={() => onTabChange("discounts")}
                    className={`px-4 py-2 text-xs font-bold uppercase border-b-2 transition-colors ${
                        activeTab === "discounts"
                            ? "border-blue-600 text-blue-700 bg-white -mb-px"
                            : "border-transparent text-gray-600 hover:text-gray-800"
                    }`}
                >
                    {t("define_item.tab_discounts")}
                </button>
            </div>
            <div className="p-4 flex flex-col gap-4 flex-1 min-h-0">
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase text-gray-600">{t("define_item.discount_type")}</label>
                    <select
                        value={discountType || ""}
                        onChange={(e) => onChange("discount_type", e.target.value)}
                        className="h-9 border border-gray-400 px-2 text-sm bg-white outline-none focus:border-blue-600"
                    >
                        <option value="">—</option>
                        <option value="percent">{t("define_item.discount_type_percent")}</option>
                        <option value="amount">{t("define_item.discount_type_amount")}</option>
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase text-gray-600">{t("define_item.discount_value")}</label>
                    <div className="relative">
                        <Percent className="absolute left-2 top-2 text-gray-400" size={14} />
                        <input
                            type="number"
                            min={0}
                            step={discountType === "percent" ? 1 : 0.01}
                            className="w-full h-9 border border-gray-400 pl-7 pr-2 text-sm font-mono outline-none focus:border-blue-600"
                            value={discountValue ?? ""}
                            onChange={(e) => onChange("discount_value", e.target.value === "" ? 0 : Number(e.target.value))}
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase text-gray-600">{t("define_item.discount_start_date")}</label>
                    <input
                        type="date"
                        className="h-9 border border-gray-400 px-2 text-sm outline-none focus:border-blue-600"
                        value={discountStartDate || ""}
                        onChange={(e) => onChange("discount_start_date", e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold uppercase text-gray-600">{t("define_item.discount_end_date")}</label>
                    <input
                        type="date"
                        className="h-9 border border-gray-400 px-2 text-sm outline-none focus:border-blue-600"
                        value={discountEndDate || ""}
                        onChange={(e) => onChange("discount_end_date", e.target.value)}
                    />
                </div>
                <div className="mt-auto pt-2 border-t border-gray-200 shrink-0">
                    <button
                        onClick={onSave}
                        disabled={loading || !name}
                        className={`w-full h-10 flex items-center justify-center gap-2 font-bold text-sm uppercase rounded-none border transition-all ${
                            loading || !name
                                ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                                : "bg-green-700 text-white border-green-800 hover:bg-green-800"
                        }`}
                    >
                        <Save size={16} />
                        {loading
                            ? t("define_item.saving")
                            : isUpdateMode
                              ? t("define_item.update_btn")
                              : t("define_item.save_btn")}
                    </button>
                </div>
            </div>
        </div>
    );
}
