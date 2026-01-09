"use client";

import { SaleResponse, updateItemQuantity } from "@/lib/api/sale-ticket";
import { Trash2 } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext";

export default function ItemTable({ saleData, onRefresh }: { saleData: SaleResponse | null, onRefresh: () => void }) {

    const { t } = useSettings();

    // 1. Helper to translate unit types
    const getUnitLabel = (type: string) => {
        switch (type) {
            // Standard Units
            case "single": return t("sale_ticket.topbar.unit_single");
            case "single-wholesale": return t("sale_ticket.topbar.unit_wholesale");
            case "packet": // Fallback if just 'packet'
            case "single-packet": return t("sale_ticket.topbar.unit_packet");
            case "single-packet-wholesale": return t("define_item.unit_packet_wholesale"); // Assuming this key exists

            // New Measure Units (Using specific sale_ticket keys now)
            case "kg": return t("sale_ticket.topbar.unit_kg");
            case "cm": return t("sale_ticket.topbar.unit_cm");
            case "m": return t("sale_ticket.topbar.unit_m");

            default: return type; // Fallback
        }
    };

    // 2. Helper to check if unit allows decimals (e.g. 3.5 kg)
    const isDecimalUnit = (type: string) => {
        return ["kg", "m", "cm", "liter"].includes(type);
    };

    // Handler for Quantity Change
    const changeQty = async (itemId: number, newQty: number) => {
        // Prevent negative or zero (unless deleting)
        if (newQty <= 0) return;
        await updateItemQuantity(itemId, newQty);
        onRefresh();
    };

    const handleRemove = async (itemId: number) => {
        if (confirm(t("sale_ticket.table.remove_confirm"))) {
            await updateItemQuantity(itemId, 0);
            onRefresh();
        }
    }

    if (!saleData || !saleData.items || saleData.items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-50">
                <span className="text-xl font-bold opacity-20 uppercase">
                    {t("sale_ticket.table.empty_cart")}
                </span>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto h-full scrollbar-thin">
            <table className="w-full text-left border-collapse">
                {/* Header */}
                <thead className="bg-gray-100 border-b border-gray-400 sticky top-0 z-10 shadow-sm">
                    <tr>
                        <th className="p-2 border-r border-gray-300 text-[10px] font-bold uppercase w-10 text-center">
                            {t("sale_ticket.table.headers.hash")}
                        </th>
                        <th className="p-2 border-r border-gray-300 text-[10px] font-bold uppercase">
                            {t("sale_ticket.table.headers.desc")}
                        </th>
                        <th className="p-2 border-r border-gray-300 text-[10px] font-bold uppercase w-16 text-center">
                            {t("sale_ticket.table.headers.unit")}
                        </th>
                        <th className="p-2 border-r border-gray-300 text-[10px] font-bold uppercase w-20 text-right">
                            {t("sale_ticket.table.headers.price")}
                        </th>
                        <th className="p-2 border-r border-gray-300 text-[10px] font-bold uppercase w-28 text-center">
                            {t("sale_ticket.table.headers.qty")}
                        </th>
                        <th className="p-2 border-r border-gray-300 text-[10px] font-bold uppercase w-24 text-right">
                            {t("sale_ticket.table.headers.total")}
                        </th>
                        <th className="p-2 text-[10px] font-bold uppercase w-10 text-center">
                            {t("sale_ticket.table.headers.del")}
                        </th>
                    </tr>
                </thead>

                {/* Body */}
                <tbody className="divide-y divide-gray-200 text-xs">
                    {saleData.items.map((item, idx) => {
                        // Check if this specific item allows decimals
                        const allowDecimals = isDecimalUnit(item.unit_type);

                        return (
                            <tr key={item.id} className="hover:bg-blue-50 group transition-colors">
                                {/* Index */}
                                <td className="p-2 border-r border-gray-100 text-center text-gray-500 font-mono">
                                    {idx + 1}
                                </td>

                                {/* Name */}
                                <td className="p-2 border-r border-gray-100 font-bold text-gray-800">
                                    {item.item_name}
                                </td>

                                {/* Unit Type (Translated & Colored) */}
                                <td className="p-2 border-r border-gray-100 text-center">
                                    <span className={`px-1 border text-[9px] uppercase font-bold ${item.unit_type === 'single' ? 'bg-white border-gray-300 text-gray-600' :
                                        allowDecimals ? 'bg-blue-100 border-blue-400 text-blue-800' : // Blue for Kg/M/Cm
                                            'bg-yellow-100 border-yellow-400 text-yellow-800' // Yellow for Packets
                                        }`}>
                                        {getUnitLabel(item.unit_type)}
                                    </span>
                                </td>

                                {/* Price */}
                                <td className="p-2 border-r border-gray-100 text-right font-mono text-gray-600">
                                    {item.price.toLocaleString()}
                                </td>

                                {/* Qty Controls */}
                                <td className="p-1 border-r border-gray-100">
                                    <div className="flex items-center justify-center gap-0">
                                        <button
                                            onClick={() => changeQty(item.id, item.quantity - 1)}
                                            className="w-8 h-6 bg-gray-200 border border-gray-400 text-black font-bold hover:bg-red-200 active:bg-red-300 transition-colors"
                                        >
                                            -
                                        </button>

                                        <input
                                            type="number"
                                            // 3. IMPORTANT: Allow decimals if needed (step="any")
                                            step={allowDecimals ? "any" : "1"}
                                            className="w-16 h-6 text-center border-t border-b border-gray-400 font-bold text-black outline-none focus:bg-yellow-50 text-xs no-spin"
                                            defaultValue={item.quantity}
                                            onBlur={(e) => {
                                                // 4. Use parseFloat for kg/m, parseInt for others
                                                const val = allowDecimals
                                                    ? parseFloat(e.target.value)
                                                    : parseInt(e.target.value);

                                                if (!isNaN(val) && val !== item.quantity) changeQty(item.id, val);
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    const val = allowDecimals
                                                        ? parseFloat((e.target as HTMLInputElement).value)
                                                        : parseInt((e.target as HTMLInputElement).value);

                                                    if (!isNaN(val)) changeQty(item.id, val);
                                                    (e.target as HTMLInputElement).blur();
                                                }
                                            }}
                                            key={item.quantity} // Forces re-render if external update happens
                                        />

                                        <button
                                            onClick={() => changeQty(item.id, item.quantity + 1)}
                                            className="w-8 h-6 bg-gray-200 border border-gray-400 text-black font-bold hover:bg-green-200 active:bg-green-300 transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                </td>

                                {/* Subtotal */}
                                <td className="p-2 border-r border-gray-100 text-right font-bold font-mono text-black">
                                    {item.subtotal.toLocaleString()}
                                </td>

                                {/* Delete */}
                                <td className="p-1 text-center">
                                    <button
                                        onClick={() => handleRemove(item.id)}
                                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}