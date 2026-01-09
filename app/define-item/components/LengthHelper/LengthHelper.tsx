"use client";

import React, { useState, useEffect, useRef } from "react";
import { Ruler } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { Item } from "../../config/types";

interface Props {
    onChange: (field: keyof Item, value: number) => void;
    unit: string; // "m" or "cm"
}

export default function LengthHelper({ onChange, unit }: Props) {
    const { t } = useSettings();

    // Refs for navigation
    const lenRef = useRef<HTMLInputElement>(null);
    const costRef = useRef<HTMLInputElement>(null);

    const [showHelper, setShowHelper] = useState(false);
    const [totalLength, setTotalLength] = useState<string>("");
    const [totalCost, setTotalCost] = useState<string>("");

    useEffect(() => {
        const savedState = localStorage.getItem("show_length_helper");
        if (savedState === "true") setShowHelper(true);
    }, []);

    const toggleHelper = (checked: boolean) => {
        setShowHelper(checked);
        localStorage.setItem("show_length_helper", String(checked));
    };

    const calculate = (lenStr: string, costStr: string) => {
        const length = parseFloat(lenStr);
        const cost = parseFloat(costStr);

        // 1. Update Quantity (Total Length is the quantity)
        if (!isNaN(length)) {
            onChange("current_quantity", length);
        }

        // 2. Calculate Cost Per Unit (Total Cost / Total Length)
        if (!isNaN(length) && !isNaN(cost) && length > 0) {
            const costPerUnit = cost / length;
            onChange("cost_price", parseFloat(costPerUnit.toFixed(2)));
        }
    };

    const handleLengthChange = (val: string) => {
        setTotalLength(val);
        calculate(val, totalCost);
    };

    const handleCostChange = (val: string) => {
        setTotalCost(val);
        calculate(totalLength, val);
    };

    const handleEnter = (e: React.KeyboardEvent, nextRef: React.RefObject<HTMLInputElement | null>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            nextRef.current?.focus();
            nextRef.current?.select();
        }
    };

    // Label Logic
    const unitLabel = unit === "m" ? "(m)" : "(cm)";

    // Select translation key based on unit
    const helperTitle = unit === "m"
        ? t("length_helper.enable_m")
        : t("length_helper.enable_cm");

    return (
        <div className="mt-2 border-t border-dashed border-gray-300 pt-2">
            <div className="flex items-center gap-2 mb-2">
                <input
                    type="checkbox"
                    id="showLengthHelper"
                    checked={showHelper}
                    onChange={(e) => toggleHelper(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="showLengthHelper" className="text-xs font-bold uppercase text-blue-700 cursor-pointer select-none flex items-center gap-1">
                    <Ruler size={12} />
                    {helperTitle}
                </label>
            </div>

            {showHelper && (
                <div className="bg-purple-50 border border-purple-200 p-3 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div>
                        <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">
                            {t("length_helper.total_length")} <span className="text-gray-400">{unitLabel}</span>
                        </label>
                        <input
                            ref={lenRef}
                            type="number"
                            placeholder="0"
                            className="w-full h-7 border border-purple-400 px-2 text-xs bg-white font-mono"
                            value={totalLength}
                            onChange={(e) => handleLengthChange(e.target.value)}
                            onKeyDown={(e) => handleEnter(e, costRef)}
                        />
                    </div>

                    <div>
                        <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">
                            {t("length_helper.total_price")}
                        </label>
                        <input
                            ref={costRef}
                            type="number"
                            placeholder="0.00"
                            className="w-full h-7 border border-purple-400 px-2 text-xs bg-white font-mono"
                            value={totalCost}
                            onChange={(e) => handleCostChange(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    costRef.current?.blur();
                                }
                            }}
                        />
                    </div>

                    <div className="col-span-2 text-[10px] text-gray-400 italic text-center pt-1">
                        {t("length_helper.auto_calc_note")}
                    </div>
                </div>
            )}
        </div>
    );
}