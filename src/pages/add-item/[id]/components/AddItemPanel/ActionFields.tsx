"use client";
import React from "react";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { Plus } from "lucide-react";

interface Props {
    expiry: string;
    setExpiry: (val: string) => void;
    handleAddItem: () => void;
    expiryRef: React.RefObject<HTMLInputElement | null>;
    addBtnRef: React.RefObject<HTMLButtonElement | null>;
    handleEnter: (e: React.KeyboardEvent, field: string) => void;
}

export default function ActionFields({
    expiry, setExpiry, handleAddItem,
    expiryRef, addBtnRef, handleEnter
}: Props) {
    const { t } = useSettings();

    return (
        <>
            {/* Expiry Date */}
            <div className="col-span-2">
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                    {t("add_item.expires_label")}
                </label>
                <input
                    ref={expiryRef}
                    type="date"
                    className="w-full h-9 border border-gray-400 px-2 text-sm uppercase rounded-none focus:border-blue-600 focus:bg-blue-50 focus:outline-none transition-colors"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    onKeyDown={(e) => handleEnter(e, "expiry")}
                />
            </div>

            {/* Add Button */}
            <div className="col-span-2">
                <label className="block text-[10px] font-bold text-transparent uppercase mb-1">
                    Action
                </label>
                <button
                    ref={addBtnRef}
                    onClick={handleAddItem}
                    className="w-full h-9 bg-green-700 text-white border border-green-800 font-bold text-sm uppercase rounded-none hover:bg-green-800 active:bg-green-900 transition-colors flex items-center justify-center gap-2"
                >
                    <Plus size={16} />
                    {t("add_item.add_btn")}
                </button>
            </div>
        </>
    );
}