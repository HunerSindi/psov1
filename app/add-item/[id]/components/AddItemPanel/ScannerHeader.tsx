"use client";
import React, { useState, useEffect } from "react";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { Item } from "@/lib/api/items";

// Import helpers
import PacketHelper from "./Helpers/PacketHelper";
import KgHelper from "./Helpers/KgHelper";
import LengthHelper from "./Helpers/LengthHelper";

interface Props {
    barcode: string;
    setBarcode: (val: string) => void;
    handleScan: (e: React.FormEvent) => void;
    barcodeRef: React.RefObject<HTMLInputElement | null>;
    error: string;
    scannedItem: Item | null;
    onCalculate: (cost: number, qty: number) => void;
}

type HelperMode = "none" | "packet" | "kg" | "meter";

export default function ScannerHeader({
    barcode,
    setBarcode,
    handleScan,
    barcodeRef,
    error,
    scannedItem,
    onCalculate
}: Props) {
    const { t } = useSettings();
    const [mode, setMode] = useState<HelperMode>("none");

    // 1. AUTO-DETECT MODE
    useEffect(() => {
        if (scannedItem) {
            const type = scannedItem.unit_type;

            if (type === 'kg') {
                setMode("kg");
            }
            else if (['m', 'cm'].includes(type)) {
                setMode("meter");
            }
            else if (['single', 'single-wholesale'].includes(type)) {
                setMode("packet");
            }
            else {
                setMode("none");
            }
        } else {
            setMode("none");
        }
    }, [scannedItem]);

    return (
        <div className="flex flex-row gap-2 items-end w-full">

            {/* 1. Barcode Input */}
            <div className="w-[140px] shrink-0">
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 truncate">
                    {t("add_item.barcode_label")}
                </label>
                <form onSubmit={handleScan}>
                    <input
                        ref={barcodeRef}
                        autoFocus
                        type="text"
                        placeholder="Scan..."
                        className="w-full h-9 border border-gray-400 px-2 rounded-none focus:border-blue-600 focus:bg-blue-50 outline-none font-mono text-sm"
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                        onFocus={(e) => e.target.select()}
                    />
                </form>
            </div>

            {/* 2. Item Name */}
            <div className="flex-1 min-w-[120px]">
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 truncate">
                    {t("add_item.item_name_label")}
                </label>
                <div className={`w-full h-9 px-2 border border-gray-400 bg-gray-100 flex items-center text-xs font-bold uppercase rounded-none truncate ${error ? "text-red-600 bg-red-50 border-red-400" : "text-gray-700"}`}>
                    {error || scannedItem?.name || "Ready..."}
                </div>
            </div>

            {/* 3. Helper Area */}
            {mode !== "none" && (
                <div className="shrink-0 animate-in fade-in slide-in-from-right-2 duration-300">
                    {/* 
                        UPDATED: Added key={scannedItem?.id}
                        This forces the component to reset (unmount/mount) 
                        whenever the item ID changes.
                    */}
                    {mode === "packet" && (
                        <PacketHelper
                            key={scannedItem?.id}
                            onCalculate={onCalculate}
                        />
                    )}
                    {mode === "kg" && (
                        <KgHelper
                            key={scannedItem?.id}
                            onCalculate={onCalculate}
                        />
                    )}
                    {mode === "meter" && (
                        <LengthHelper
                            key={scannedItem?.id}
                            onCalculate={onCalculate}
                        />
                    )}
                </div>
            )}
        </div>
    );
}