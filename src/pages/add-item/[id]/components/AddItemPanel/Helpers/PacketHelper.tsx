"use client";

import React, { useState, useRef } from "react";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    onCalculate: (cost: number, qty: number) => void;
}

export default function PacketHelper({ onCalculate }: Props) {
    const { t } = useSettings();

    // 1. Create Refs for navigation
    const costRef = useRef<HTMLInputElement>(null);
    const unitsRef = useRef<HTMLInputElement>(null);
    const countRef = useRef<HTMLInputElement>(null);

    const [boxCost, setBoxCost] = useState("");
    const [unitsPerBox, setUnitsPerBox] = useState("");
    const [boxCount, setBoxCount] = useState("");

    const handleChange = (costStr: string, unitsStr: string, countStr: string) => {
        setBoxCost(costStr);
        setUnitsPerBox(unitsStr);
        setBoxCount(countStr);

        const costVal = parseFloat(costStr);
        const unitsVal = parseFloat(unitsStr);
        const countVal = parseFloat(countStr);

        let finalCost = 0;
        let finalQty = 0;

        // 1. Calculate Cost Price: (Price / Units per packet)
        if (costVal > 0 && unitsVal > 0) {
            finalCost = costVal / unitsVal;
        }

        // 2. Calculate Total Quantity: (Number of boxes * Units per box)
        if (countVal > 0 && unitsVal > 0) {
            finalQty = countVal * unitsVal;
        }

        // Update Parent if we have valid data
        if (finalCost > 0 || finalQty > 0) {
            onCalculate(parseFloat(finalCost.toFixed(2)), finalQty);
        }
    };

    // 2. Helper to switch focus on Enter
    const handleEnter = (e: React.KeyboardEvent, nextRef: React.RefObject<HTMLInputElement | null>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            nextRef.current?.focus();
            nextRef.current?.select();
        }
    };

    return (
        <div className="flex items-end gap-1">

            {/* 1. Box Cost */}
            <div className="flex-1">
                <label className="block text-[9px] font-bold text-purple-700 uppercase mb-0.5 text-center">
                    {t("packet_helper.box_cost")}
                </label>
                <input
                    ref={costRef}
                    type="number"
                    placeholder="0"
                    className="w-full h-9 border border-purple-300 px-1 text-center text-xs rounded-none outline-none focus:border-purple-600"
                    value={boxCost}
                    onChange={e => handleChange(e.target.value, unitsPerBox, boxCount)}
                    // Next -> Units Per Box
                    onKeyDown={(e) => handleEnter(e, unitsRef)}
                />
            </div>

            {/* 2. Units Per Box */}
            <div className="flex-1">
                <label className="block text-[9px] font-bold text-purple-700 uppercase mb-0.5 text-center">
                    {t("packet_helper.units_per_box")}
                </label>
                <input
                    ref={unitsRef}
                    type="number"
                    placeholder="0"
                    className="w-full h-9 border border-purple-300 px-1 text-center text-xs rounded-none outline-none focus:border-purple-600"
                    value={unitsPerBox}
                    onChange={e => handleChange(boxCost, e.target.value, boxCount)}
                    // Next -> Box Count
                    onKeyDown={(e) => handleEnter(e, countRef)}
                />
            </div>

            {/* 3. Box Count */}
            <div className="flex-1">
                <label className="block text-[9px] font-bold text-purple-700 uppercase mb-0.5 text-center">
                    {t("packet_helper.box_count")}
                </label>
                <input
                    ref={countRef}
                    type="number"
                    placeholder="0"
                    className="w-full h-9 border border-purple-300 px-1 text-center text-xs rounded-none outline-none focus:border-purple-600"
                    value={boxCount}
                    onChange={e => handleChange(boxCost, unitsPerBox, e.target.value)}
                    // Finish (Blur)
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            countRef.current?.blur();
                        }
                    }}
                />
            </div>
        </div>
    );
}