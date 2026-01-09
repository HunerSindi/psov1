"use client";

import React from "react";
import { Item } from "../config/types";
import { Package, Calculator } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext";

// IMPORT HELPERS
import PacketHelper from "./PacketHelper/PacketHelper";
import KgHelper from "./KgHelper/KgHelper";
import LengthHelper from "./LengthHelper/LengthHelper"; // <-- Import new component

interface Props {
    item: Item;
    handleChange: (field: keyof Item, value: any) => void;
    refs: {
        qtyRef: React.RefObject<HTMLInputElement | null>;
        costRef: React.RefObject<HTMLInputElement | null>;
        singleSellRef: React.RefObject<HTMLInputElement | null>;
        singleWholesaleRef: React.RefObject<HTMLInputElement | null>;

        packetUnitRef: React.RefObject<HTMLInputElement | null>;
        packetQtyRef: React.RefObject<HTMLInputElement | null>;
        packetCostRef: React.RefObject<HTMLInputElement | null>;
        packetSellRef: React.RefObject<HTMLInputElement | null>;
    };
    onEnter: (current: string) => void;
    onFocusSelect: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export default function PricingStock({
    item,
    handleChange,
    refs,
    onEnter,
    onFocusSelect,
}: Props) {
    const { t } = useSettings();

    // Logic for existing packet types
    const showWholesale = ["single-wholesale", "single-packet-wholesale"].includes(item.unit_type);
    const showPacket = ["single-packet", "single-packet-wholesale"].includes(item.unit_type);

    // --- HELPER VISIBILITY LOGIC ---
    const showSingleHelper = ["single", "single-wholesale"].includes(item.unit_type);
    const showKgHelper = item.unit_type === "kg";
    // Check for length types
    const showLengthHelper = ["cm", "m"].includes(item.unit_type);

    const handlePacketChange = (field: keyof Item, value: number) => {
        handleChange(field, value);

        if (field === "packet_quantity") {
            if (item.unit_per_packet > 0) {
                handleChange("current_quantity", value * item.unit_per_packet);
            }
        } else if (field === "packet_cost_price") {
            if (item.unit_per_packet > 0) {
                const singleCost = value / item.unit_per_packet;
                handleChange("cost_price", parseFloat(singleCost.toFixed(2)));
            }
        } else if (field === "unit_per_packet") {
            if (item.packet_quantity > 0) {
                handleChange("current_quantity", item.packet_quantity * value);
            }
            if (item.packet_cost_price > 0) {
                const singleCost = item.packet_cost_price / value;
                handleChange("cost_price", parseFloat(singleCost.toFixed(2)));
            }
        }
    };

    return (
        <div className="bg-white border border-gray-400 flex flex-col h-full">
            <div className="bg-gray-100 border-b border-gray-400 p-3">
                <h2 className="font-bold text-sm uppercase text-gray-700 tracking-wide">
                    2. {t("define_item.pricing_stock")}
                </h2>
            </div>

            <div className="p-4 flex flex-col gap-4">

                {/* --- PACKET SECTION --- */}
                {showPacket && (
                    <div className="border border-blue-300 bg-blue-50/50 p-3">
                        <div className="flex items-center gap-2 mb-3 border-b border-blue-200 pb-1">
                            <Package size={14} className="text-blue-700" />
                            <h3 className="text-xs font-bold uppercase text-blue-800">
                                {t("define_item.packet_settings")}
                            </h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                                    {t("define_item.unit_per_packet")}
                                </label>
                                <input
                                    ref={refs.packetUnitRef}
                                    type="number"
                                    className="w-full h-8 border border-gray-400 px-2 text-sm rounded-none focus:border-blue-600 focus:outline-none bg-white"
                                    value={item.unit_per_packet}
                                    onChange={(e) => handlePacketChange("unit_per_packet", Number(e.target.value))}
                                    onKeyDown={(e) => e.key === "Enter" && onEnter("packetUnit")}
                                    onFocus={onFocusSelect}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                                    {t("define_item.packet_qty")}
                                </label>
                                <input
                                    ref={refs.packetQtyRef}
                                    type="number"
                                    className="w-full h-8 border border-gray-400 px-2 text-sm rounded-none focus:border-blue-600 focus:outline-none bg-white font-bold"
                                    value={item.packet_quantity}
                                    onChange={(e) => handlePacketChange("packet_quantity", Number(e.target.value))}
                                    onKeyDown={(e) => e.key === "Enter" && onEnter("packetQty")}
                                    onFocus={onFocusSelect}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                                    {t("define_item.packet_cost")}
                                </label>
                                <input
                                    ref={refs.packetCostRef}
                                    type="number"
                                    className="w-full h-8 border border-gray-400 px-2 text-sm rounded-none focus:border-blue-600 focus:outline-none bg-white"
                                    value={item.packet_cost_price}
                                    onChange={(e) => handlePacketChange("packet_cost_price", Number(e.target.value))}
                                    onKeyDown={(e) => e.key === "Enter" && onEnter("packetCost")}
                                    onFocus={onFocusSelect}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-900 uppercase mb-1">
                                    {t("define_item.packet_price")}
                                </label>
                                <input
                                    ref={refs.packetSellRef}
                                    type="number"
                                    className="w-full h-8 border-2 border-gray-400 px-2 text-sm rounded-none focus:border-black focus:outline-none bg-white font-bold"
                                    value={item.packet_price}
                                    onChange={(e) => handleChange("packet_price", Number(e.target.value))}
                                    onKeyDown={(e) => e.key === "Enter" && onEnter("packetSell")}
                                    onFocus={onFocusSelect}
                                />
                            </div>
                        </div>

                        {showWholesale && (
                            <div className="mt-4">
                                <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                                    {t("define_item.packet_wholesale")}
                                </label>
                                <input
                                    type="number"
                                    className="w-full h-8 border border-gray-400 px-2 text-sm rounded-none focus:border-blue-600 focus:outline-none bg-white"
                                    value={item.packet_wholesale_price}
                                    onChange={(e) => handleChange("packet_wholesale_price", Number(e.target.value))}
                                    onFocus={onFocusSelect}
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* --- SINGLE / UNIT SECTION --- */}
                <div className="border border-gray-300 p-3 bg-gray-50">
                    <div className="flex items-center gap-2 mb-3 border-b border-gray-200 pb-1">
                        <Calculator size={14} className="text-gray-600" />
                        <h3 className="text-xs font-bold uppercase text-gray-700">
                            {t("define_item.single_unit_settings")}
                        </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                                {t("define_item.curr_qty")}
                            </label>
                            <input
                                ref={refs.qtyRef}
                                type="number"
                                className="w-full h-8 border border-gray-400 px-2 text-sm rounded-none focus:border-blue-600 focus:outline-none bg-white font-bold"
                                value={item.current_quantity}
                                onChange={(e) => handleChange("current_quantity", Number(e.target.value))}
                                onKeyDown={(e) => e.key === "Enter" && onEnter("qty")}
                                onFocus={onFocusSelect}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                                {t("define_item.cost_price")}
                            </label>
                            <input
                                ref={refs.costRef}
                                type="number"
                                className="w-full h-8 border border-gray-400 px-2 text-sm rounded-none focus:border-blue-600 focus:outline-none bg-white"
                                value={item.cost_price}
                                onChange={(e) => handleChange("cost_price", Number(e.target.value))}
                                onKeyDown={(e) => e.key === "Enter" && onEnter("cost")}
                                onFocus={onFocusSelect}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-900 uppercase mb-1">
                                {t("define_item.sell_price")}
                            </label>
                            <input
                                ref={refs.singleSellRef}
                                type="number"
                                className="w-full h-8 border-2 border-gray-400 px-2 text-sm rounded-none focus:border-black focus:outline-none bg-white font-bold"
                                value={item.single_price}
                                onChange={(e) => handleChange("single_price", Number(e.target.value))}
                                onKeyDown={(e) => e.key === "Enter" && onEnter("singleSell")}
                                onFocus={onFocusSelect}
                            />
                        </div>

                        {showWholesale && (
                            <div>
                                <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                                    {t("define_item.wholesale_price")}
                                </label>
                                <input
                                    ref={refs.singleWholesaleRef}
                                    type="number"
                                    className="w-full h-8 border border-gray-400 px-2 text-sm rounded-none focus:border-blue-600 focus:outline-none bg-white"
                                    value={item.wholesale_price}
                                    onChange={(e) => handleChange("wholesale_price", Number(e.target.value))}
                                    onFocus={onFocusSelect}
                                />
                            </div>
                        )}
                    </div>

                    {/* --- HELPERS AREA --- */}

                    {/* 1. Packet Helper (Single/Wholesale) */}
                    {showSingleHelper && (
                        <PacketHelper onChange={handleChange} />
                    )}

                    {/* 2. KG Helper */}
                    {showKgHelper && (
                        <KgHelper onChange={handleChange} />
                    )}

                    {/* 3. Length Helper (CM/M) */}
                    {showLengthHelper && (
                        <LengthHelper onChange={handleChange} unit={item.unit_type} />
                    )}
                </div>

            </div>
        </div>
    );
}