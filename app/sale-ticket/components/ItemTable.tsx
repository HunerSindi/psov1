"use client";

import { useState, useRef, useEffect } from "react";
import { SaleResponse, updateItemQuantity } from "@/lib/api/sale-ticket";
import { Trash2, Delete, Check } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext";

export default function ItemTable({ saleData, onRefresh }: { saleData: SaleResponse | null, onRefresh: () => void }) {
    const { t } = useSettings();

    // Track which item has the keypad open
    const [activeItemId, setActiveItemId] = useState<number | null>(null);
    const [keypadValue, setKeypadValue] = useState("");

    // NEW: Track Screen Position for the Keypad
    const [keypadPos, setKeypadPos] = useState({ top: 0, left: 0 });

    // To handle outside clicks
    const keypadRef = useRef<HTMLDivElement>(null);

    // Helpers
    const getUnitLabel = (type: string) => {
        switch (type) {
            case "single": return t("sale_ticket.topbar.unit_single");
            case "single-wholesale": return t("sale_ticket.topbar.unit_wholesale");
            case "packet":
            case "single-packet": return t("sale_ticket.topbar.unit_packet");
            case "single-packet-wholesale": return t("define_item.unit_packet_wholesale");
            case "kg": return t("sale_ticket.topbar.unit_kg");
            case "cm": return t("sale_ticket.topbar.unit_cm");
            case "m": return t("sale_ticket.topbar.unit_m");
            default: return type;
        }
    };

    const isDecimalUnit = (type: string) => ["kg", "m", "cm", "liter"].includes(type);

    const changeQty = async (itemId: number, newQty: number) => {
        if (newQty <= 0) return;
        await updateItemQuantity(itemId, newQty);
        onRefresh();
    };

    const handleRemove = async (itemId: number) => {
        if (confirm(t("sale_ticket.table.remove_confirm"))) {
            await updateItemQuantity(itemId, 0);
            onRefresh();
        }
    };

    // Close keypad if clicked outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (activeItemId !== null && keypadRef.current && !keypadRef.current.contains(event.target as Node)) {
                submitKeypad(activeItemId);
            }
        }
        // Use capture to ensure we catch it before other handlers if needed
        document.addEventListener("mousedown", handleClickOutside, true);
        return () => document.removeEventListener("mousedown", handleClickOutside, true);
    }, [activeItemId, keypadValue]);

    // Open Keypad Logic - NOW CALCULATES POSITION
    const openKeypad = (itemId: number, e: React.MouseEvent<HTMLInputElement>) => {
        // 1. Get position of the input element relative to the viewport
        const rect = e.currentTarget.getBoundingClientRect();

        // 2. Set position (Center keypad horizontally relative to input, place below input)
        // 112 is roughly half the width of the keypad (w-56 = 224px / 2)
        setKeypadPos({
            top: rect.bottom + 5,
            left: rect.left + (rect.width / 2) - 112
        });

        // 3. Clear value and set active
        setKeypadValue("");
        setActiveItemId(itemId);
    };

    // Submit Logic
    const submitKeypad = (itemId: number) => {
        const item = saleData?.items.find(i => i.id === itemId);
        if (!item) {
            setActiveItemId(null);
            return;
        }

        const allowDecimals = isDecimalUnit(item.unit_type);

        // If empty or 0 or invalid, revert to original quantity
        if (!keypadValue || keypadValue === "0" || keypadValue === ".") {
            setActiveItemId(null);
            return;
        }

        const parsed = allowDecimals ? parseFloat(keypadValue) : parseInt(keypadValue);

        if (!isNaN(parsed) && parsed > 0 && parsed !== item.quantity) {
            changeQty(itemId, parsed);
        }

        setActiveItemId(null);
    };

    // Keypad Button Click
    const handleKeypadClick = (key: string, itemId: number) => {
        if (key === "C") {
            setKeypadValue("");
        } else if (key === "DEL") {
            setKeypadValue(prev => prev.length > 0 ? prev.slice(0, -1) : "");
        } else if (key === "ENTER") {
            submitKeypad(itemId);
        } else {
            // Prevent multiple dots
            if (key === "." && keypadValue.includes(".")) return;

            const item = saleData?.items.find(i => i.id === itemId);
            if (key === "." && item && !isDecimalUnit(item.unit_type)) return;

            setKeypadValue(prev => prev + key);
        }
    };

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
        <div className="flex-1 overflow-y-auto h-full scrollbar-thin pb-40">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100 border-b border-gray-400 sticky top-0 z-10 shadow-sm">
                    <tr>
                        <th className="p-2 border-r border-gray-300 text-[10px] font-bold uppercase w-10 text-center">{t("sale_ticket.table.headers.hash")}</th>
                        <th className="p-2 border-r border-gray-300 text-[10px] font-bold uppercase">{t("sale_ticket.table.headers.desc")}</th>
                        <th className="p-2 border-r border-gray-300 text-[10px] font-bold uppercase w-16 text-center">{t("sale_ticket.table.headers.unit")}</th>
                        <th className="p-2 border-r border-gray-300 text-[10px] font-bold uppercase w-20 text-right">{t("sale_ticket.table.headers.price")}</th>
                        <th className="p-2 border-r border-gray-300 text-[10px] font-bold uppercase w-28 text-center">{t("sale_ticket.table.headers.qty")}</th>
                        <th className="p-2 border-r border-gray-300 text-[10px] font-bold uppercase w-24 text-right">{t("sale_ticket.table.headers.total")}</th>
                        <th className="p-2 text-[10px] font-bold uppercase w-10 text-center">{t("sale_ticket.table.headers.del")}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-xs">
                    {saleData.items.map((item, idx) => {
                        const allowDecimals = isDecimalUnit(item.unit_type);
                        const isThisKeypadOpen = activeItemId === item.id;

                        return (
                            <tr key={item.id} className="hover:bg-blue-50 group transition-colors">
                                <td className="p-2 border-r border-gray-100 text-center text-gray-500 font-mono">{idx + 1}</td>
                                <td className="p-2 border-r border-gray-100 font-bold text-gray-800">{item.item_name}</td>
                                <td className="p-2 border-r border-gray-100 text-center">
                                    <span className={`px-1 border text-[9px] uppercase font-bold ${item.unit_type === 'single' ? 'bg-white border-gray-300 text-gray-600' : allowDecimals ? 'bg-blue-100 border-blue-400 text-blue-800' : 'bg-yellow-100 border-yellow-400 text-yellow-800'}`}>
                                        {getUnitLabel(item.unit_type)}
                                    </span>
                                </td>
                                <td className="p-2 border-r border-gray-100 text-right font-mono text-gray-600">{item.price.toLocaleString()}</td>

                                {/* QTY CELL */}
                                <td className="p-1 border-r border-gray-100 relative">
                                    <div className="flex items-center justify-center gap-0">
                                        <button onClick={() => changeQty(item.id, item.quantity - 1)} className="w-8 h-6 bg-gray-200 border border-gray-400 text-black font-bold hover:bg-red-200 active:bg-red-300 transition-colors">-</button>

                                        {/* INPUT TRIGGER */}
                                        <input
                                            type="text"
                                            readOnly
                                            className="w-16 h-6 text-center border-t border-b border-gray-400 font-bold text-black outline-none focus:bg-yellow-50 text-xs cursor-pointer"
                                            value={isThisKeypadOpen ? keypadValue : item.quantity}
                                            placeholder={item.quantity.toString()}
                                            onClick={(e) => openKeypad(item.id, e)} // PASS EVENT HERE
                                        />

                                        <button onClick={() => changeQty(item.id, item.quantity + 1)} className="w-8 h-6 bg-gray-200 border border-gray-400 text-black font-bold hover:bg-green-200 active:bg-green-300 transition-colors">+</button>
                                    </div>
                                </td>

                                <td className="p-2 border-r border-gray-100 text-right font-bold font-mono text-black">{item.subtotal.toLocaleString()}</td>
                                <td className="p-1 text-center">
                                    <button onClick={() => handleRemove(item.id)} className="text-gray-400 hover:text-red-600 transition-colors p-1"><Trash2 size={14} /></button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* 
                MOVED KEYPAD OUTSIDE THE LOOP AND TABLE 
                It uses 'fixed' position based on state calculations
            */}
            {activeItemId !== null && (
                <div
                    ref={keypadRef}
                    className="fixed w-56 bg-white border border-gray-400 shadow-2xl z-[9999] animate-in fade-in zoom-in-95"
                    style={{
                        top: `${keypadPos.top}px`,
                        left: `${keypadPos.left}px`
                    }}
                >
                    <div className="bg-gray-100 px-2 py-1 text-xs font-bold text-gray-600 border-b border-gray-300 text-center uppercase tracking-wider">
                        {t("sale_ticket.table.headers.qty")}
                    </div>
                    <div className="grid grid-cols-4 gap-1 p-2 bg-gray-50" dir="ltr">
                        {["1", "2", "3"].map((key) => (
                            <KeypadButton key={key} val={key} onClick={(k) => handleKeypadClick(k, activeItemId)} />
                        ))}
                        <div className="bg-gray-100 border border-gray-200"></div>

                        {["4", "5", "6"].map((key) => (
                            <KeypadButton key={key} val={key} onClick={(k) => handleKeypadClick(k, activeItemId)} />
                        ))}
                        <KeypadButton val="DEL" onClick={(k) => handleKeypadClick(k, activeItemId)} isAction />

                        {["7", "8", "9"].map((key) => (
                            <KeypadButton key={key} val={key} onClick={(k) => handleKeypadClick(k, activeItemId)} />
                        ))}
                        <KeypadButton val="C" onClick={(k) => handleKeypadClick(k, activeItemId)} isAction />

                        <KeypadButton val="0" onClick={(k) => handleKeypadClick(k, activeItemId)} />
                        <KeypadButton val="." onClick={(k) => handleKeypadClick(k, activeItemId)} />
                        <KeypadButton val="ENTER" onClick={(k) => handleKeypadClick(k, activeItemId)} isAction colSpan={2} />
                    </div>
                </div>
            )}
        </div>
    );
}

// Keypad Button Component (Unchanged)
function KeypadButton({ val, onClick, isAction = false, colSpan = 1 }: { val: string, onClick: (val: string) => void, isAction?: boolean, colSpan?: number }) {
    const content = val === "DEL" ? <Delete size={16} /> : val === "ENTER" ? <Check size={16} /> : val;
    return (
        <button
            onClick={(e) => { e.stopPropagation(); onClick(val); }}
            className={`
                h-10 flex items-center justify-center font-bold text-base transition-colors border
                ${isAction
                    ? val === "ENTER" ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-800"
                        : val === "C" ? "bg-red-100 hover:bg-red-200 text-red-700 border-red-300"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-700 border-gray-300"
                    : "bg-white hover:bg-gray-100 text-black border-gray-300"
                }
                active:scale-95
                ${colSpan === 2 ? "col-span-2" : "col-span-1"}
            `}
        >
            {content}
        </button>
    );
}