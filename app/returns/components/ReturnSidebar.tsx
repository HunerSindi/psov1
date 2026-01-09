"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, RotateCcw } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    onAdd: (barcode: string, unit: string, qty: number, restock: boolean) => Promise<void>;
    loading: boolean;
}

export default function ReturnSidebar({ onAdd, loading }: Props) {
    const router = useRouter();
    const { t } = useSettings();

    const [barcode, setBarcode] = useState("");
    const [qty, setQty] = useState("1"); // Use string to handle decimals easily
    const [unitType, setUnitType] = useState("single");
    const [restock, setRestock] = useState(true);
    const barcodeRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const quantity = parseFloat(qty);
        if (isNaN(quantity) || quantity <= 0) {
            alert("Invalid Quantity");
            return;
        }

        await onAdd(barcode, unitType, quantity, restock);

        // Reset
        setBarcode("");
        setQty("1");
        barcodeRef.current?.focus();
    };

    return (
        <div className="w-80 bg-white border border-gray-400 p-4 flex flex-col gap-4 h-fit">
            <div className="bg-gray-50 border border-gray-200 p-3">
                <h3 className="text-xs font-bold uppercase text-gray-500 mb-3 border-b border-gray-300 pb-1">
                    {t("returns.sidebar.title")}
                </h3>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    {/* Barcode */}
                    <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">
                            {t("returns.sidebar.barcode")}
                        </label>
                        <div className="flex">
                            <div className="w-8 flex items-center justify-center bg-gray-200 border border-gray-400 border-r-0">
                                <Search size={14} />
                            </div>
                            <input
                                ref={barcodeRef}
                                autoFocus
                                value={barcode}
                                onChange={e => setBarcode(e.target.value)}
                                className="flex-1 h-8 border border-gray-400 px-2 text-sm outline-none focus:border-red-600"
                            />
                        </div>
                    </div>

                    {/* Unit & Qty */}
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">
                                {t("returns.sidebar.unit")}
                            </label>
                            <select
                                value={unitType} onChange={e => setUnitType(e.target.value)}
                                className="w-full h-8 border border-gray-400 px-1 text-sm bg-white outline-none"
                            >
                                <option value="single">{t("returns.sidebar.single")}</option>
                                <option value="single-wholesale">{t("returns.sidebar.wholesale")}</option>
                                <option value="single-packet">{t("returns.sidebar.packet")}</option>
                            </select>
                        </div>
                        <div className="w-20">
                            <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">
                                {t("returns.sidebar.qty")}
                            </label>
                            <input
                                type="number"
                                step="any" // <--- ALLOWS DECIMALS (e.g. 1.5)
                                min="0.01"
                                value={qty}
                                onChange={e => setQty(e.target.value)}
                                className="w-full h-8 border border-gray-400 px-2 text-center font-bold text-sm outline-none focus:border-red-600"
                            />
                        </div>
                    </div>

                    <div className="hidden flex items-center gap-2 py-1">
                        <input
                            type="checkbox"
                            checked={restock}
                            onChange={e => setRestock(e.target.checked)}
                            className="accent-red-600 w-4 h-4"
                        />
                        <label className="text-xs font-bold text-gray-700">
                            {t("returns.sidebar.restock")}
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !barcode}
                        className="bg-red-600 text-white h-9 uppercase font-bold text-xs hover:bg-red-700 border border-red-800 disabled:opacity-50 transition-colors"
                    >
                        {loading ? t("returns.sidebar.btn_processing") : t("returns.sidebar.btn_add")}
                    </button>
                </form>
            </div>

            <button
                onClick={() => router.push("/returns/history")}
                className="hidden flex items-center justify-center gap-2 bg-white border border-gray-400 h-10 text-xs font-bold uppercase hover:bg-gray-100 transition-colors"
            >
                <RotateCcw size={16} /> {t("returns.sidebar.view_history")}
            </button>
        </div>
    );
}