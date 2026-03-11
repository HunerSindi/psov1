"use client";
import React, { useState, useRef } from "react";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { getItemByBarcode } from "@/lib/api/items"; // Use existing API
import { Search, Plus, Loader2, CheckCircle2 } from "lucide-react";

interface Props {
    onAddItem: (data: any) => Promise<void>;
}

export default function AddItemPanel({ onAddItem }: Props) {
    const { t } = useSettings();

    // State
    const [barcode, setBarcode] = useState("");
    const [scannedItem, setScannedItem] = useState<any>(null); // Temp item storage
    const [loading, setLoading] = useState(false);

    // Fields
    const [qty, setQty] = useState<number | "">("");
    const [unit, setUnit] = useState("single");
    const [price, setPrice] = useState<number | "">("");

    // Refs
    const qtyRef = useRef<HTMLInputElement>(null);
    const barcodeRef = useRef<HTMLInputElement>(null);

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!barcode) return;

        setLoading(true);
        const item = await getItemByBarcode(barcode);
        setLoading(false);

        if (item) {
            setScannedItem(item);
            setQty(1);
            setUnit(item.unit_type);
            setPrice(item.cost_price || 0); // Default refund to cost price
            setTimeout(() => qtyRef.current?.focus(), 100);
        } else {
            alert("Item not found!");
            setScannedItem(null);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!scannedItem) return;

        await onAddItem({
            item_id: scannedItem.id,
            quantity: Number(qty),
            unit_type: unit,
            refund_price_per_unit: Number(price)
        });

        // Reset for next item
        setBarcode("");
        setScannedItem(null);
        setQty("");
        setPrice("");
        barcodeRef.current?.focus();
    };

    return (
        <div className="bg-white border-b-4 border-purple-600 p-3 shadow-md sticky top-[52px] z-20">
            <div className="flex gap-4 items-end">

                {/* 1. Barcode Scanner */}
                <div className="w-[180px]">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                        {t("company_return.form.scan_placeholder")}
                    </label>
                    <form onSubmit={handleSearch} className="flex gap-0">
                        <input
                            ref={barcodeRef}
                            autoFocus
                            type="text"
                            value={barcode}
                            onChange={e => setBarcode(e.target.value)}
                            className="w-full h-9 border border-gray-400 px-2 rounded-none focus:border-purple-600 outline-none font-mono text-sm"
                            placeholder="Scan..."
                        />
                        <button type="submit" className="bg-gray-200 border border-l-0 border-gray-400 px-2 hover:bg-gray-300">
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                        </button>
                    </form>
                </div>

                {/* 2. Item Name (Read Only) */}
                <div className="flex-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                        {t("company_return.form.item_name")}
                    </label>
                    <div className="w-full h-9 bg-gray-100 border border-gray-400 px-2 flex items-center text-sm font-bold uppercase text-purple-800">
                        {scannedItem ? (
                            <><CheckCircle2 size={14} className="mr-1" /> {scannedItem.name}</>
                        ) : (
                            <span className="text-gray-400">Ready to scan...</span>
                        )}
                    </div>
                </div>

                {/* 3. Inputs (Only visible if scanned) */}
                {scannedItem && (
                    <form onSubmit={handleAdd} className="contents">
                        <div className="w-24">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                                {t("company_return.form.qty")}
                            </label>
                            <input
                                ref={qtyRef}
                                type="number"
                                required
                                value={qty}
                                onChange={e => setQty(Number(e.target.value))}
                                className="w-full h-9 border border-gray-400 px-2 text-center font-bold text-sm outline-none focus:border-purple-600"
                            />
                        </div>

                        <div className="w-28">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                                {t("company_return.form.unit")}
                            </label>
                            <select
                                value={unit}
                                onChange={e => setUnit(e.target.value)}
                                className="w-full h-9 border border-gray-400 px-1 text-sm outline-none bg-white"
                            >
                                <option value="single">Single</option>
                                <option value="single-packet">Packet</option>
                                <option value="kg">Kg</option>
                                <option value="m">Meter</option>
                            </select>
                        </div>

                        <div className="w-28">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                                {t("company_return.form.price")}
                            </label>
                            <input
                                type="number"
                                required
                                value={price}
                                onChange={e => setPrice(Number(e.target.value))}
                                className="w-full h-9 border border-gray-400 px-2 text-center font-mono text-sm outline-none focus:border-purple-600"
                            />
                        </div>

                        <div className="w-32">
                            <label className="block text-[10px] font-bold text-transparent uppercase mb-1">Action</label>
                            <button
                                type="submit"
                                className="w-full h-9 bg-purple-700 text-white font-bold uppercase text-xs hover:bg-purple-800 flex items-center justify-center gap-1"
                            >
                                <Plus size={16} /> {t("company_return.form.add_btn")}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}