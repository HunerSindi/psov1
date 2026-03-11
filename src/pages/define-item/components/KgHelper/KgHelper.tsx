"use client";

import React, { useState, useEffect, useRef } from "react";
import { Scale } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { Item } from "../../config/types";

interface Props {
    onChange: (field: keyof Item, value: number) => void;
}

export default function KgHelper({ onChange }: Props) {
    const { t } = useSettings();

    // Refs for enter key navigation
    const weightRef = useRef<HTMLInputElement>(null);
    const costRef = useRef<HTMLInputElement>(null);

    const [showHelper, setShowHelper] = useState(false);
    const [totalWeight, setTotalWeight] = useState<string>("");
    const [totalCost, setTotalCost] = useState<string>("");

    // Load checkbox state from localStorage
    useEffect(() => {
        const savedState = localStorage.getItem("show_kg_helper");
        if (savedState === "true") setShowHelper(true);
    }, []);

    const toggleHelper = (checked: boolean) => {
        setShowHelper(checked);
        localStorage.setItem("show_kg_helper", String(checked));
    };

    // Calculation Logic: Cost Price = Total Cost / Total Weight
    const calculate = (weightStr: string, costStr: string) => {
        const weight = parseFloat(weightStr);
        const cost = parseFloat(costStr);

        // 1. Update Quantity (Quantity is just the weight you bought)
        if (!isNaN(weight)) {
            onChange("current_quantity", weight);
        }

        // 2. Calculate Cost Per Kg
        if (!isNaN(weight) && !isNaN(cost) && weight > 0) {
            const costPerKg = cost / weight;
            onChange("cost_price", parseFloat(costPerKg.toFixed(2)));
        }
    };

    const handleWeightChange = (val: string) => {
        setTotalWeight(val);
        calculate(val, totalCost);
    };

    const handleCostChange = (val: string) => {
        setTotalCost(val);
        calculate(totalWeight, val);
    };

    const handleEnter = (e: React.KeyboardEvent, nextRef: React.RefObject<HTMLInputElement | null>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            nextRef.current?.focus();
            nextRef.current?.select();
        }
    };

    return (
        <div className="mt-2 border-t border-dashed border-gray-300 pt-2">
            <div className="flex items-center gap-2 mb-2">
                <input
                    type="checkbox"
                    id="showKgHelper"
                    checked={showHelper}
                    onChange={(e) => toggleHelper(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="showKgHelper" className="text-xs font-bold uppercase text-blue-700 cursor-pointer select-none flex items-center gap-1">
                    <Scale size={12} />
                    {t("kg_helper.enable_calculator")}
                </label>
            </div>

            {showHelper && (
                <div className="bg-orange-50 border border-orange-200 p-3 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div>
                        <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">
                            {t("kg_helper.total_weight")}
                        </label>
                        <input
                            ref={weightRef}
                            type="number"
                            placeholder="0"
                            className="w-full h-7 border border-orange-400 px-2 text-xs bg-white font-mono"
                            value={totalWeight}
                            onChange={(e) => handleWeightChange(e.target.value)}
                            onKeyDown={(e) => handleEnter(e, costRef)}
                        />
                    </div>

                    <div>
                        <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">
                            {t("kg_helper.total_price")}
                        </label>
                        <input
                            ref={costRef}
                            type="number"
                            placeholder="0.00"
                            className="w-full h-7 border border-orange-400 px-2 text-xs bg-white font-mono"
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
                        {t("kg_helper.auto_calc_note")}
                    </div>
                </div>
            )}
        </div>
    );
}