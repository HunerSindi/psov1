"use client";
import React, { useState, useRef } from "react";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    onCalculate: (cost: number, qty: number) => void;
}

export default function LengthHelper({ onCalculate }: Props) {
    const { t } = useSettings();

    // 1. Create Refs
    const priceRef = useRef<HTMLInputElement>(null);
    const lengthRef = useRef<HTMLInputElement>(null);

    const [totalPrice, setTotalPrice] = useState("");
    const [length, setLength] = useState("");

    const handleChange = (p: string, l: string) => {
        setTotalPrice(p); setLength(l);

        const pVal = parseFloat(p);
        const lVal = parseFloat(l);

        if (pVal > 0 && lVal > 0) {
            const costPerUnit = pVal / lVal;
            onCalculate(parseFloat(costPerUnit.toFixed(2)), lVal);
        }
    };

    // 2. Helper for Enter key
    const handleEnter = (e: React.KeyboardEvent, nextRef: React.RefObject<HTMLInputElement | null>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            nextRef.current?.focus();
            nextRef.current?.select();
        }
    };

    return (
        <div className="grid grid-cols-12 gap-2 animate-in slide-in-from-top-1 fade-in">
            <div className="col-span-6">
                <label className="block text-[9px] font-bold text-gray-500 uppercase">
                    {t("length_helper.total_price")}
                </label>
                <input
                    ref={priceRef}
                    type="number"
                    placeholder="0.00"
                    className="w-full h-9 border border-teal-300 px-2 text-xs font-mono rounded-none outline-none focus:border-teal-600"
                    value={totalPrice}
                    onChange={e => handleChange(e.target.value, length)}
                    // Move to Length Input
                    onKeyDown={(e) => handleEnter(e, lengthRef)}
                />
            </div>
            <div className="col-span-6">
                <label className="block text-[9px] font-bold text-gray-500 uppercase">
                    {t("length_helper.total_length")}
                </label>
                <input
                    ref={lengthRef}
                    type="number"
                    placeholder="0.00"
                    className="w-full h-9 border border-teal-300 px-2 text-xs font-mono rounded-none outline-none focus:border-teal-600"
                    value={length}
                    onChange={e => handleChange(totalPrice, e.target.value)}
                    // Finish editing (blur)
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            lengthRef.current?.blur();
                        }
                    }}
                />
            </div>
        </div>
    );
}