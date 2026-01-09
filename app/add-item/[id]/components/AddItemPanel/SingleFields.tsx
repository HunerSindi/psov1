"use client";
import React from "react";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    qty: number | "";
    cost: number | "";
    price: number | "";
    wholesalePrice: number | "";
    // Handlers
    setQty: (val: number) => void;
    setCost: (val: number) => void;
    setPrice: (val: number) => void;
    setWholesalePrice: (val: number) => void;
    // Refs
    refs: {
        qty: React.RefObject<HTMLInputElement | null>;
        cost: React.RefObject<HTMLInputElement | null>;
        price: React.RefObject<HTMLInputElement | null>;
        wholesale: React.RefObject<HTMLInputElement | null>;
    };
    handleEnter: (e: React.KeyboardEvent, field: string) => void;
    showWholesale: boolean | null;
}

export default function SingleFields({
    qty, cost, price, wholesalePrice,
    setQty, setCost, setPrice, setWholesalePrice,
    refs, handleEnter, showWholesale
}: Props) {
    const { t } = useSettings();

    return (
        <>
            {/* 1. Single Quantity (Highlighted Blue) */}
            <div className="col-span-1 ">
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                    {t("add_item.qty_label")}
                </label>
                <input
                    ref={refs.qty}
                    type="number"
                    className="w-full h-9 border border-blue-600 bg-blue-50 px-2 text-sm font-bold text-center rounded-none focus:outline-none focus:bg-blue-100 transition-colors"
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    onKeyDown={(e) => handleEnter(e, "qty")}
                    onFocus={(e) => e.target.select()}
                />
            </div>

            {/* 2. Cost Price */}
            <div className="col-span-1">
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                    {t("add_item.cost_label")}
                </label>
                <input
                    ref={refs.cost}
                    type="number"
                    className="w-full h-9 border border-gray-400 px-2 text-sm text-center rounded-none focus:border-blue-600 focus:bg-blue-50 focus:outline-none transition-colors"
                    value={cost}
                    onChange={(e) => setCost(Number(e.target.value))}
                    onKeyDown={(e) => handleEnter(e, "cost")}
                    onFocus={(e) => e.target.select()}
                />
            </div>

            {/* 3. Sell Price */}
            <div className="col-span-1">
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                    {t("add_item.price_label")}
                </label>
                <input
                    ref={refs.price}
                    type="number"
                    className="w-full h-9 border border-gray-400 px-2 text-sm text-center rounded-none focus:border-blue-600 focus:bg-blue-50 focus:outline-none transition-colors"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    onKeyDown={(e) => handleEnter(e, "price")}
                    onFocus={(e) => e.target.select()}
                />
            </div>

            {/* 4. Wholesale Price (Orange Theme) */}
            {showWholesale && (
                <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-orange-600 uppercase mb-1">
                        {t("add_item.whl_label")}
                    </label>
                    <input
                        ref={refs.wholesale}
                        type="number"
                        className="w-full h-9 border border-orange-300 px-2 text-sm text-center rounded-none focus:border-orange-600 focus:bg-orange-50 focus:outline-none transition-colors"
                        value={wholesalePrice}
                        onChange={(e) => setWholesalePrice(Number(e.target.value))}
                        onKeyDown={(e) => handleEnter(e, "wholesale")}
                        onFocus={(e) => e.target.select()}
                    />
                </div>
            )}
        </>
    );
}