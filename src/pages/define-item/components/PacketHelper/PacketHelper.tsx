"use client";

import React, { useState, useEffect, useRef } from "react";
import { Calculator } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { Item } from "../../config/types";

interface Props {
    onChange: (field: keyof Item, value: number) => void;
}

export default function PacketHelper({ onChange }: Props) {
    const { t } = useSettings();

    // 1. Create Refs for internal navigation
    const costRef = useRef<HTMLInputElement>(null);
    const unitsRef = useRef<HTMLInputElement>(null);
    const qtyRef = useRef<HTMLInputElement>(null);

    const [showHelper, setShowHelper] = useState(false);

    const [pkgCost, setPkgCost] = useState<string>("");
    const [unitsPerPkg, setUnitsPerPkg] = useState<string>("");
    const [pkgQty, setPkgQty] = useState<string>("");

    useEffect(() => {
        const savedState = localStorage.getItem("show_packet_helper");
        if (savedState === "true") setShowHelper(true);
    }, []);

    const toggleHelper = (checked: boolean) => {
        setShowHelper(checked);
        localStorage.setItem("show_packet_helper", String(checked));
    };

    const calculate = (pCost: string, uPerPkg: string, pQty: string) => {
        const cost = parseFloat(pCost);
        const units = parseFloat(uPerPkg);
        const qty = parseFloat(pQty);

        if (!isNaN(cost) && !isNaN(units) && units > 0) {
            const singleCost = cost / units;
            onChange("cost_price", parseFloat(singleCost.toFixed(2)));
        }

        if (!isNaN(qty) && !isNaN(units)) {
            const totalQty = qty * units;
            onChange("current_quantity", totalQty);
        }
    };

    const handleCostChange = (val: string) => {
        setPkgCost(val);
        calculate(val, unitsPerPkg, pkgQty);
    };

    const handleUnitsChange = (val: string) => {
        setUnitsPerPkg(val);
        calculate(pkgCost, val, pkgQty);
    };

    const handleQtyChange = (val: string) => {
        setPkgQty(val);
        calculate(pkgCost, unitsPerPkg, val);
    };

    // 2. Helper function for Enter key navigation
    const handleEnter = (e: React.KeyboardEvent, nextRef: React.RefObject<HTMLInputElement | null>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            nextRef.current?.focus();
            // Optional: Select text when focusing next
            nextRef.current?.select();
        }
    };

    return (
        <div className="mt-2 border-t border-dashed border-gray-300 pt-2">
            <div className="flex items-center gap-2 mb-2">
                <input
                    type="checkbox"
                    id="showHelper"
                    checked={showHelper}
                    onChange={(e) => toggleHelper(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="showHelper" className="text-xs font-bold uppercase text-blue-700 cursor-pointer select-none flex items-center gap-1">
                    <Calculator size={12} />
                    {t("packet_helper.enable_calculator")}
                </label>
            </div>

            {showHelper && (
                <div className="bg-yellow-50 border border-yellow-200 p-3 grid grid-cols-3 gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    {/* Box Cost */}
                    <div>
                        <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">
                            {t("packet_helper.box_cost")}
                        </label>
                        <input
                            ref={costRef}
                            type="number"
                            placeholder="0.00"
                            className="w-full h-7 border border-yellow-400 px-2 text-xs bg-white font-mono"
                            value={pkgCost}
                            onChange={(e) => handleCostChange(e.target.value)}
                            // Move to Units
                            onKeyDown={(e) => handleEnter(e, unitsRef)}
                        />
                    </div>

                    {/* Units / Box */}
                    <div>
                        <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">
                            {t("packet_helper.units_per_box")}
                        </label>
                        <input
                            ref={unitsRef}
                            type="number"
                            placeholder="0"
                            className="w-full h-7 border border-yellow-400 px-2 text-xs bg-white font-mono"
                            value={unitsPerPkg}
                            onChange={(e) => handleUnitsChange(e.target.value)}
                            // Move to Qty
                            onKeyDown={(e) => handleEnter(e, qtyRef)}
                        />
                    </div>

                    {/* Box Count */}
                    <div>
                        <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">
                            {t("packet_helper.box_count")}
                        </label>
                        <input
                            ref={qtyRef}
                            type="number"
                            placeholder="0"
                            className="w-full h-7 border border-yellow-400 px-2 text-xs bg-white font-mono"
                            value={pkgQty}
                            onChange={(e) => handleQtyChange(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    // Blur to finish, or you could focus costRef to loop
                                    qtyRef.current?.blur();
                                }
                            }}
                        />
                    </div>

                    <div className="col-span-3 text-[10px] text-gray-400 italic text-center pt-1">
                        {t("packet_helper.auto_update_note")}
                    </div>
                </div>
            )}
        </div>
    );
}