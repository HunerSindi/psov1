"use client";
import React, { useState, useRef } from "react";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    onCalculate: (cost: number, qty: number) => void;
}

export default function KgHelper({ onCalculate }: Props) {
    const { t } = useSettings();

    // 1. Create Refs for navigation
    const priceRef = useRef<HTMLInputElement>(null);
    const weightRef = useRef<HTMLInputElement>(null);

    const [totalPrice, setTotalPrice] = useState("");
    const [weight, setWeight] = useState("");

    const handleChange = (p: string, w: string) => {
        setTotalPrice(p); setWeight(w);

        const pVal = parseFloat(p);
        const wVal = parseFloat(w);

        if (pVal > 0 && wVal > 0) {
            const costPerKg = pVal / wVal;
            onCalculate(parseFloat(costPerKg.toFixed(2)), wVal);
        }
    };

    // 2. Helper to handle Enter key
    const handleEnter = (e: React.KeyboardEvent, nextRef: React.RefObject<HTMLInputElement | null>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            nextRef.current?.focus();
            nextRef.current?.select(); // Selects text so you can overwrite easily
        }
    };

    return (
        <div className="grid grid-cols-12 gap-2 animate-in slide-in-from-top-1 fade-in">
            <div className="col-span-6">
                <label className="block text-[9px] font-bold text-gray-500 uppercase">
                    {t("kg_helper.total_price")}
                </label>
                <input
                    ref={priceRef}
                    type="number"
                    placeholder="0.00"
                    className="w-full h-9 border border-orange-300 px-2 text-xs font-mono rounded-none outline-none focus:border-orange-600"
                    value={totalPrice}
                    onChange={e => handleChange(e.target.value, weight)}
                    // Move to Weight Input
                    onKeyDown={(e) => handleEnter(e, weightRef)}
                />
            </div>
            <div className="col-span-6">
                <label className="block text-[9px] font-bold text-gray-500 uppercase">
                    {t("kg_helper.total_weight")}
                </label>
                <input
                    ref={weightRef}
                    type="number"
                    placeholder="0.00"
                    className="w-full h-9 border border-orange-300 px-2 text-xs font-mono rounded-none outline-none focus:border-orange-600"
                    value={weight}
                    onChange={e => handleChange(totalPrice, e.target.value)}
                    // Finish editing (blur)
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            weightRef.current?.blur();
                        }
                    }}
                />
            </div>
        </div>
    );
}