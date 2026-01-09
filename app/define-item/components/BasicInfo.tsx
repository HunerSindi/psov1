"use client";

import React from "react";
import { Item, UNIT_TYPES } from "../config/types";
import { AlertCircle, CheckCircle2, Dices } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Props {
    item: Item;
    handleChange: (field: keyof Item, value: any) => void;
    searchBarcode: string;
    setSearchBarcode: (val: string) => void;
    handleScan: (e: React.FormEvent) => void;
    msg: string;
    refs: {
        nameRef: React.RefObject<HTMLInputElement | null>;
        dateRef: React.RefObject<HTMLInputElement | null>;
        alertRef: React.RefObject<HTMLInputElement | null>;
        unitRef: React.RefObject<HTMLSelectElement | null>;
    };
    onEnter: (current: string) => void;
    onFocusSelect: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export default function BasicInfo({
    item,
    handleChange,
    searchBarcode,
    setSearchBarcode,
    handleScan,
    msg,
    refs,
    onEnter,
    onFocusSelect,
}: Props) {
    const { t, dir } = useSettings();

    const generateRandomBarcode = () => {
        const randomCode = Math.floor(100000000 + Math.random() * 900000000).toString();
        setSearchBarcode(randomCode);
    };

    // --- TRIGGER ON BLUR ---
    // This wrapper allows us to call handleScan without a real form event
    const handleBlur = () => {
        // Only trigger if there is actual text to search
        if (searchBarcode && searchBarcode.trim() !== "") {
            const mockEvent = { preventDefault: () => { } } as React.FormEvent;
            handleScan(mockEvent);
        }
    };

    const getUnitLabel = (type: string) => {
        switch (type) {
            case "single": return t("define_item.unit_single");
            case "single-wholesale": return t("define_item.unit_wholesale");
            case "single-packet": return t("define_item.unit_packet");
            case "single-packet-wholesale": return t("define_item.unit_packet_wholesale");
            case "kg": return t("define_item.unit_kg");
            case "cm": return t("define_item.unit_cm");
            case "m": return t("define_item.unit_m");
            default: return type;
        }
    };

    return (
        <div className="bg-white border border-gray-400 flex flex-col h-full">
            <div className="bg-gray-100 border-b border-gray-400 p-3">
                <h2 className="font-bold text-sm uppercase text-gray-700 tracking-wide">
                    {t("define_item.basic_info")}
                </h2>
            </div>

            <div className="p-4 flex flex-col gap-4">
                {/* SCANNER */}
                <div className="bg-blue-50 border border-blue-200 p-3">
                    <form onSubmit={handleScan} className="flex w-full">
                        <button
                            type="button"
                            onClick={generateRandomBarcode}
                            title={t("define_item.random_barcode_title")}
                            className="shrink-0 bg-gray-200 text-gray-800 px-3 h-10 font-bold text-sm uppercase hover:bg-gray-300 border-gray-400 border transition-colors rounded-none flex items-center gap-1"
                        >
                            <Dices size={16} />
                        </button>

                        <input
                            autoFocus
                            type="text"
                            placeholder={t("define_item.search_placeholder")}
                            value={searchBarcode}
                            onChange={(e) => setSearchBarcode(e.target.value)}
                            onFocus={onFocusSelect}

                            // --- CHANGE: Trigger only on Blur (Focus lost) ---
                            onBlur={handleBlur}

                            className="flex-1 w-full min-w-0 h-10 border border-gray-400 px-3 text-lg font-mono outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-none placeholder:text-sm"
                        />

                        <button
                            type="submit"
                            className={`shrink-0 bg-black text-white px-4 h-10 font-bold text-sm uppercase hover:bg-gray-800 border border-black transition-colors rounded-none ${dir === 'rtl' ? 'border-r-0' : 'border-l-0'}`}
                        >
                            {t("define_item.scan_btn")}
                        </button>
                    </form>

                    {msg && (
                        <div className={`mt-2 flex items-center gap-2 text-xs font-bold uppercase ${msg.includes("Error") ? "text-red-600" : "text-green-700"}`}>
                            {msg.includes("Error") ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
                            {msg}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-4">

                    {/* UNIT TYPE SELECT */}
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                            {t("define_item.unit_type")}
                        </label>
                        <Select
                            value={item.unit_type}
                            onValueChange={(val) => handleChange("unit_type", val)}
                            dir={dir}
                        >
                            <SelectTrigger className="w-full h-9 rounded-none border-gray-400 focus:ring-0 focus:border-blue-600 bg-white shadow-none">
                                <SelectValue placeholder={t("define_item.select_unit_placeholder")} />
                            </SelectTrigger>
                            <SelectContent className="rounded-none border-gray-400">
                                {UNIT_TYPES.map((type) => (
                                    <SelectItem
                                        key={type}
                                        value={type}
                                        className="rounded-none focus:bg-gray-100 cursor-pointer font-medium"
                                    >
                                        {getUnitLabel(type)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* NAME */}
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                            {t("define_item.name")}
                        </label>
                        <input
                            ref={refs.nameRef}
                            type="text"
                            value={item.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && onEnter("name")}
                            onFocus={onFocusSelect}
                            className="w-full h-9 border border-gray-400 px-2 text-sm rounded-none focus:border-blue-600 focus:outline-none focus:bg-blue-50 transition-colors"
                            placeholder={t("define_item.name_placeholder")}
                        />
                    </div>

                    {/* DATE */}
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                            {t("define_item.expiry_date")}
                        </label>
                        <input
                            ref={refs.dateRef}
                            type="date"
                            value={item.expiration_date || ""}
                            onChange={(e) => handleChange("expiration_date", e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && onEnter("date")}
                            className="w-full h-9 border border-gray-400 px-2 text-sm rounded-none focus:border-blue-600 focus:outline-none uppercase"
                        />
                    </div>

                    {/* ALERT */}
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                            {t("define_item.alert_qty")}
                        </label>
                        <input
                            ref={refs.alertRef}
                            type="number"
                            value={item.alert_quantity}
                            onChange={(e) => handleChange("alert_quantity", Number(e.target.value))}
                            onKeyDown={(e) => e.key === "Enter" && onEnter("alert")}
                            onFocus={onFocusSelect}
                            className="w-full h-9 border border-gray-400 px-2 text-sm rounded-none focus:border-blue-600 focus:outline-none"
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}