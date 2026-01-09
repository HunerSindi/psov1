"use client";

import React, { useState } from "react";
import { Barcode, Plus, Trash2, Save, AlertTriangle } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

interface Props {
    barcodes: string[];
    setBarcodes: (codes: string[]) => void;
    loading: boolean;
    onSave: () => void;
    isUpdateMode: boolean;
    name: string;
}

export default function BarcodeSection({
    barcodes,
    setBarcodes,
    loading,
    onSave,
    isUpdateMode,
    name,
}: Props) {
    const { t, dir } = useSettings();

    const [newBarcode, setNewBarcode] = useState("");
    const [isErrorOpen, setIsErrorOpen] = useState(false);

    const addBarcode = () => {
        if (newBarcode && !barcodes.includes(newBarcode)) {
            setBarcodes([...barcodes, newBarcode]);
            setNewBarcode("");
        }
    };

    const removeBarcode = (code: string) => {
        if (barcodes.length <= 1) {
            setIsErrorOpen(true);
            return;
        }
        setBarcodes(barcodes.filter((b) => b !== code));
    };

    return (
        <>
            <Dialog open={isErrorOpen} onOpenChange={setIsErrorOpen}>
                <DialogContent className="bg-white border-2 border-red-600 rounded-none shadow-none max-w-sm p-0 gap-0" dir={dir}>
                    <DialogHeader className="bg-red-600 p-3 text-white">
                        <DialogTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
                            <AlertTriangle size={16} className="text-white" />
                            {t("define_item.action_denied")}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="p-4 bg-white">
                        <DialogDescription className="text-gray-800 text-sm font-medium">
                            {t("define_item.min_barcode_error")}
                        </DialogDescription>
                    </div>
                    <div className="p-3 bg-gray-100 border-t border-gray-300 flex justify-end">
                        <button
                            onClick={() => setIsErrorOpen(false)}
                            className="bg-white border border-gray-400 px-4 py-1 text-xs font-bold uppercase hover:bg-gray-200 text-black transition-colors"
                        >
                            {t("define_item.close")}
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* 
                UPDATED HERE: 
                Changed 'h-full' to 'h-[calc(100vh-200px)]'.
                This forces the card to be exactly that height, regardless of parent.
            */}
            <div className="bg-white border border-gray-400 flex flex-col h-[calc(100vh-76px)]">

                {/* Header (Fixed) */}
                <div className="bg-gray-100 border-b border-gray-400 p-3 shrink-0">
                    <h2 className="font-bold text-sm uppercase text-gray-700 tracking-wide">
                        {t("define_item.section_barcodes")}
                    </h2>
                </div>

                {/* Content Area (Flex container) */}
                <div className="p-4 flex flex-col gap-4 flex-1 min-h-0">

                    {/* Add Input (Fixed) */}
                    <div className="flex gap-0 shrink-0">
                        <div className={`w-10 flex items-center justify-center bg-gray-200 border border-gray-400 ${dir === 'rtl' ? 'border-l-0' : 'border-r-0'}`}>
                            <Barcode size={18} className="text-gray-600" />
                        </div>
                        <input
                            type="text"
                            placeholder={t("define_item.add_barcode_placeholder")}
                            className="flex-1 h-9 border border-gray-400 px-2 text-sm font-mono outline-none focus:border-blue-600 focus:bg-blue-50 rounded-none transition-colors"
                            value={newBarcode}
                            onChange={(e) => setNewBarcode(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    addBarcode();
                                }
                            }}
                        />
                        <button
                            onClick={addBarcode}
                            className={`bg-gray-200 hover:bg-gray-300 border border-gray-400 px-3 h-9 text-gray-700 rounded-none transition-colors ${dir === 'rtl' ? 'border-r-0' : 'border-l-0'}`}
                            title="Add"
                        >
                            <Plus size={16} />
                        </button>
                    </div>

                    {/* 
                        Barcode List (Scrollable Area)
                        flex-1: takes all remaining space defined by the calculation
                        overflow-y-auto: scrolls when content is too big
                    */}
                    <div className="flex-1 bg-gray-50 border border-gray-400 overflow-y-auto min-h-0">
                        {barcodes.length === 0 ? (
                            <div className="p-4 text-center text-xs text-gray-400 italic uppercase">
                                {t("define_item.no_barcodes")}
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {barcodes.map((code, idx) => (
                                    <div
                                        key={idx}
                                        className="flex justify-between items-center bg-white p-2 hover:bg-blue-50 group"
                                    >
                                        <span className={`font-mono text-sm text-gray-800 font-bold ${dir === 'rtl' ? 'pr-2' : 'pl-2'}`}>
                                            {code}
                                        </span>
                                        <button
                                            onClick={() => removeBarcode(code)}
                                            className="text-gray-400 hover:text-red-600 px-2 transition-colors"
                                            title="Remove"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer / Save Button (Fixed at bottom) */}
                    <div className="mt-auto pt-2 border-t border-gray-200 shrink-0">
                        <button
                            onClick={onSave}
                            disabled={loading || !name}
                            className={`w-full h-10 flex items-center justify-center gap-2 font-bold text-sm uppercase rounded-none border transition-all ${loading || !name
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
        </>
    );
}