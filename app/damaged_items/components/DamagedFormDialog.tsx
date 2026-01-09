"use client";
import { useState, useEffect, useRef } from "react";
import { DamagedItem } from "@/lib/api/damaged_items";
import { getItemByBarcode } from "@/lib/api/items"; // Import your existing API
import { useSettings } from "@/lib/contexts/SettingsContext";
import { Search, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: DamagedItem) => Promise<void>;
    initialData?: DamagedItem | null;
    isEditing: boolean;
}

export default function DamagedFormDialog({ isOpen, onClose, onSubmit, initialData, isEditing }: Props) {
    const { t } = useSettings();

    // Form State
    const [form, setForm] = useState<DamagedItem>({
        item_id: 0,
        user_id: 1, // Default user
        quantity: 1,
        unit_type: "single",
        reason: ""
    });

    // Scanner State
    const [barcode, setBarcode] = useState("");
    const [scannedName, setScannedName] = useState("");
    const [scanLoading, setScanLoading] = useState(false);
    const [scanError, setScanError] = useState("");

    const quantityRef = useRef<HTMLInputElement>(null);

    // Reset or Load Data
    useEffect(() => {
        if (isOpen) {
            if (initialData && isEditing) {
                setForm({ ...initialData });
                setScannedName(initialData.item_name || ""); // Display name if editing
            } else {
                // Reset for new entry
                setForm({
                    item_id: 0,
                    user_id: 1,
                    quantity: 1,
                    unit_type: "single",
                    reason: ""
                });
                setBarcode("");
                setScannedName("");
                setScanError("");
            }
        }
    }, [isOpen, initialData, isEditing]);

    // Handle Barcode Search
    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!barcode.trim()) return;

        setScanLoading(true);
        setScanError("");
        setScannedName("");

        try {
            const item = await getItemByBarcode(barcode);

            if (item) {
                // Item Found
                setForm(prev => ({
                    ...prev,
                    item_id: item.id,
                    unit_type: item.unit_type // Auto-select unit type from item
                }));
                setScannedName(item.name);

                // Move focus to quantity
                setTimeout(() => quantityRef.current?.focus(), 100);
            } else {
                setScanError(t("add_item.item_not_found") || "Item not found");
                setForm(prev => ({ ...prev, item_id: 0 }));
            }
        } catch (error) {
            setScanError("Error searching item");
        } finally {
            setScanLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.item_id === 0) {
            setScanError("Please scan a valid item first");
            return;
        }
        await onSubmit(form);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white border-2 border-gray-600 w-full max-w-md flex flex-col shadow-xl">

                {/* Header */}
                <div className="bg-gray-200 border-b border-gray-400 p-2 flex justify-between items-center">
                    <h2 className="font-bold text-sm uppercase text-gray-800">
                        {isEditing ? t("damaged_items.form.edit_title") : t("damaged_items.form.create_title")}
                    </h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-red-600 font-bold px-2">X</button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 bg-gray-50 flex flex-col gap-4">

                    {/* BARCODE SEARCH (Only show in Create Mode) */}
                    {!isEditing ? (
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                                {t("damaged_items.form.label_item_id")}
                            </label>
                            <div className="flex gap-0">
                                <input
                                    type="text"
                                    value={barcode}
                                    onChange={e => setBarcode(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
                                    className={`flex-1 border h-9 px-2 text-sm outline-none font-mono placeholder:text-gray-400 ${scanError ? 'border-red-500 bg-red-50' : 'border-gray-400 focus:border-blue-600'}`}
                                    placeholder="Scan Barcode & Press Enter"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => handleSearch()}
                                    disabled={scanLoading}
                                    className="bg-blue-600 text-white px-3 h-9 flex items-center justify-center hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {scanLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                                </button>
                            </div>

                            {/* Status Message */}
                            <div className="mt-1 h-5">
                                {scanError && (
                                    <div className="text-red-600 text-[10px] font-bold flex items-center gap-1 uppercase">
                                        <AlertCircle size={10} /> {scanError}
                                    </div>
                                )}
                                {scannedName && (
                                    <div className="text-green-700 text-[10px] font-bold flex items-center gap-1 uppercase">
                                        <CheckCircle2 size={10} /> {scannedName}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        // Edit Mode: Just show the name
                        <div className="bg-blue-50 border border-blue-200 p-2 mb-2">
                            <label className="block text-[10px] font-bold uppercase text-blue-500 mb-1">
                                Selected Item
                            </label>
                            <div className="font-bold text-sm text-blue-900 uppercase">
                                {scannedName || "Unknown Item"}
                            </div>
                        </div>
                    )}

                    {/* Quantity & Unit */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                                {t("damaged_items.form.label_qty")}
                            </label>
                            <input
                                ref={quantityRef}
                                type="number"
                                step="any"
                                required
                                value={form.quantity}
                                onChange={e => setForm({ ...form, quantity: Number(e.target.value) })}
                                className="w-full h-9 border border-gray-400 px-2 text-sm outline-none focus:border-red-600 font-bold text-center"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                                {t("damaged_items.form.label_unit")}
                            </label>
                            <select
                                value={form.unit_type}
                                onChange={e => setForm({ ...form, unit_type: e.target.value })}
                                className="w-full h-9 border border-gray-400 px-2 text-sm outline-none bg-white focus:border-red-600 cursor-pointer"
                            >
                                <option value="single">Single</option>
                                <option value="single-packet">Packet</option>
                                <option value="kg">Kg</option>
                                <option value="m">Meter</option>
                            </select>
                        </div>
                    </div>

                    {/* Reason */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                            {t("damaged_items.form.label_reason")}
                        </label>
                        <textarea
                            required
                            rows={3}
                            value={form.reason}
                            onChange={e => setForm({ ...form, reason: e.target.value })}
                            className="w-full border border-gray-400 p-2 text-sm outline-none focus:border-red-600 resize-none"
                            placeholder="Briefly explain what happened..."
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 border-t border-gray-300 pt-3 mt-2">
                        <button type="button" onClick={onClose} className="flex-1 bg-white border border-gray-400 py-2 text-xs font-bold uppercase hover:bg-gray-200 text-black h-9">
                            {t("damaged_items.form.btn_cancel")}
                        </button>
                        <button
                            type="submit"
                            disabled={!form.item_id}
                            className={`flex-1 border py-2 text-xs font-bold uppercase text-white h-9 transition-colors ${!form.item_id ? 'bg-gray-400 border-gray-500 cursor-not-allowed' : 'bg-red-700 border-red-800 hover:bg-red-800'}`}
                        >
                            {t("damaged_items.form.btn_save")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}