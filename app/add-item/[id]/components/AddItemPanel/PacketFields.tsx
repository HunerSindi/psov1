"use client";
import React from "react";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    unitPerPacket: number | "";
    pktQty: number | "";
    pktCost: number | "";
    pktPrice: number | "";
    pktWholesalePrice: number | "";
    // Handlers
    onUnitChange: (val: number) => void;
    onQtyChange: (val: number) => void;
    onCostChange: (val: number) => void;
    onPriceChange: (val: number) => void;
    onWholesaleChange: (val: number) => void;
    // Refs
    refs: {
        unit: React.RefObject<HTMLInputElement | null>;
        qty: React.RefObject<HTMLInputElement | null>;
        cost: React.RefObject<HTMLInputElement | null>;
        price: React.RefObject<HTMLInputElement | null>;
        wholesale: React.RefObject<HTMLInputElement | null>;
    };
    handleEnter: (e: React.KeyboardEvent, field: string) => void;
    showWholesale: boolean | null;
}

export default function PacketFields({
    unitPerPacket, pktQty, pktCost, pktPrice, pktWholesalePrice,
    onUnitChange, onQtyChange, onCostChange, onPriceChange, onWholesaleChange,
    refs, handleEnter, showWholesale
}: Props) {
    const { t } = useSettings();

    return (
        <>
            {/* 1. Unit Per Packet (First Focus) */}
            <div className="col-span-1">
                <label className="block text-[10px] font-bold text-purple-600 uppercase mb-1">
                    {/* {t("add_item.unit_per_packet") || "Unit / Pkt"} */} Unit / Pkt
                </label>
                <input
                    ref={refs.unit}
                    type="number"
                    className="w-full h-9 border border-purple-300 px-2 text-center text-sm font-bold rounded-none focus:border-purple-600 focus:bg-purple-50 outline-none transition-colors"
                    value={unitPerPacket}
                    onChange={(e) => onUnitChange(Number(e.target.value))}
                    onKeyDown={(e) => handleEnter(e, "pktUnit")}
                    onFocus={(e) => e.target.select()}
                />
            </div>

            {/* 2. Packet Quantity */}
            <div className="col-span-1">
                <label className="block text-[10px] font-bold text-purple-600 uppercase mb-1">
                    {t("add_item.pkt_qty_label")}
                </label>
                <input
                    ref={refs.qty}
                    type="number"
                    className="w-full h-9 border border-purple-300 px-2 text-center text-sm font-bold rounded-none focus:border-purple-600 focus:bg-purple-50 outline-none transition-colors"
                    value={pktQty}
                    onChange={(e) => onQtyChange(Number(e.target.value))}
                    onKeyDown={(e) => handleEnter(e, "pktQty")}
                    onFocus={(e) => e.target.select()}
                />
            </div>

            {/* 3. Packet Cost */}
            <div className="col-span-1">
                <label className="block text-[10px] font-bold text-purple-600 uppercase mb-1">
                    {t("add_item.pkt_cost_label")}
                </label>
                <input
                    ref={refs.cost}
                    type="number"
                    className="w-full h-9 border border-purple-300 px-2 text-center text-sm rounded-none focus:border-purple-600 focus:bg-purple-50 outline-none transition-colors"
                    value={pktCost}
                    onChange={(e) => onCostChange(Number(e.target.value))}
                    onKeyDown={(e) => handleEnter(e, "pktCost")}
                    onFocus={(e) => e.target.select()}
                />
            </div>

            {/* 4. Packet Price */}
            <div className="col-span-1">
                <label className="block text-[10px] font-bold text-purple-600 uppercase mb-1">
                    {t("add_item.pkt_price_label")}
                </label>
                <input
                    ref={refs.price}
                    type="number"
                    className="w-full h-9 border border-purple-300 px-2 text-center text-sm rounded-none focus:border-purple-600 focus:bg-purple-50 outline-none transition-colors"
                    value={pktPrice}
                    onChange={(e) => onPriceChange(Number(e.target.value))}
                    onKeyDown={(e) => handleEnter(e, "pktPrice")}
                    onFocus={(e) => e.target.select()}
                />
            </div>

            {/* 5. Packet Wholesale (Optional) */}
            {showWholesale && (
                <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-orange-600 uppercase mb-1">
                        {t("add_item.pkt_whl_label")}
                    </label>
                    <input
                        ref={refs.wholesale}
                        type="number"
                        className="w-full h-9 border border-orange-300 px-2 text-center text-sm rounded-none focus:border-orange-600 focus:bg-orange-50 outline-none transition-colors"
                        value={pktWholesalePrice}
                        onChange={(e) => onWholesaleChange(Number(e.target.value))}
                        onKeyDown={(e) => handleEnter(e, "pktWholesale")}
                        onFocus={(e) => e.target.select()}
                    />
                </div>
            )}
        </>
    );
}