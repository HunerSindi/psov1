"use client";

import { useState, useRef } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, LocalItem } from "@/lib/local-db";
import { addItemToSale } from "@/lib/api/sale-ticket";
import { getItemByBarcode } from "@/lib/api/items";
import { Plus, Trash2, Image as ImageIcon, Tag, Scale } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext";

// Extend LocalItem locally to support the new field without breaking your DB file
interface ExtendedLocalItem extends LocalItem {
    defaultQuantity?: number;
}

interface Props {
    categoryId: number;
    saleId: number | undefined;
    onRefresh: () => void;
    editMode: boolean;
}

export default function LocalItemGrid({ categoryId, saleId, onRefresh, editMode }: Props) {
    const { t } = useSettings();

    // Cast the query result to include the new field
    const items = useLiveQuery(() => db.items.where({ categoryId }).toArray(), [categoryId]) as ExtendedLocalItem[] | undefined;

    const [isAddOpen, setIsAddOpen] = useState(false);

    // New Item Form State
    const [newItem, setNewItem] = useState({
        name: "",
        barcode: "",
        price: "",
        image: "",
        unitType: "single",
        defaultQuantity: "1" // Default is 1
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- HANDLERS ---

    const handleItemClick = async (item: ExtendedLocalItem) => {
        if (editMode) return;
        if (!saleId) {
            alert("No active ticket.");
            return;
        }

        try {
            // 1. Determine the actual unit type from Server
            // We check the server because local 'single' might actually be 'kg'
            let typeToSend = item.unitType;

            if (typeToSend === "single") {
                const realItem = await getItemByBarcode(item.barcode);
                if (realItem && ["kg", "m", "cm", "liter"].includes(realItem.unit_type)) {
                    typeToSend = realItem.unit_type;
                }
            }

            // 2. Get the specific quantity defined for this shortcut
            const qtyToAdd = item.defaultQuantity && item.defaultQuantity > 0 ? item.defaultQuantity : 1;

            // 3. Add to sale immediately
            const success = await addItemToSale(saleId, item.barcode, typeToSend, qtyToAdd);

            if (success) {
                onRefresh();
            } else {
                alert(`${t("sale_ticket.topbar.alert_item_not_found")}\n(${item.barcode})`);
            }

        } catch (error) {
            console.error("Error adding item:", error);
            alert("Failed to add item.");
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewItem({ ...newItem, image: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveItem = async (e: React.FormEvent) => {
        e.preventDefault();

        // Save to Dexie with the new defaultQuantity field
        // Note: Dexie allows adding extra fields even if not defined in the schema for basic tables
        await db.items.add({
            categoryId,
            name: newItem.name,
            barcode: newItem.barcode,
            price: parseFloat(newItem.price) || 0,
            image: newItem.image,
            unitType: newItem.unitType,
            // @ts-ignore - Ignoring TS check if LocalItem interface in db file isn't updated yet
            defaultQuantity: parseFloat(newItem.defaultQuantity) || 1
        });

        setIsAddOpen(false);
        // Reset Form
        setNewItem({ name: "", barcode: "", price: "", image: "", unitType: "single", defaultQuantity: "1" });
    };

    const handleDelete = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (confirm(t("sale_ticket.catalog.prompt_delete_shortcut"))) {
            await db.items.delete(id);
        }
    };

    return (
        <div className="h-full w-full relative p-1 overflow-y-auto">
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-1 content-start">
                {items?.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => handleItemClick(item)}
                        className={`
                            relative aspect-square border bg-white flex flex-col shadow-sm overflow-hidden select-none group
                            ${editMode ? "border-dashed border-yellow-500 cursor-default" : "border-gray-400 hover:border-blue-600 active:scale-95 cursor-pointer"}
                        `}
                    >
                        {/* IMAGE */}
                        <div className="flex-1 w-full relative overflow-hidden bg-gray-100">
                            {item.image ? (
                                <div className="h-32 flex items-center justify-center overflow-hidden">
                                    <img src={item.image} alt={item.name} className="object-fill" />
                                </div>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <ImageIcon size={24} />
                                </div>
                            )}

                            {/* Unit Badge */}
                            {item.unitType !== 'single' && (
                                <div className="absolute top-0 left-0 bg-white text-black text-[8px] font-bold px-1 uppercase border-r border-b border-black/20 z-20">
                                    {item.unitType === 'packet'
                                        ? t("sale_ticket.topbar.unit_packet")
                                        : t("sale_ticket.topbar.unit_wholesale")
                                    }
                                </div>
                            )}

                            {/* Default Qty Badge (Show if not 1) */}
                            {item.defaultQuantity && item.defaultQuantity !== 1 && (
                                <div className="absolute bottom-0 right-0 bg-yellow-300 text-black text-[9px] font-bold px-1.5 py-0.5 z-20 rounded-tl-md">
                                    x{item.defaultQuantity}
                                </div>
                            )}
                        </div>

                        {/* Text */}
                        <div className="h-10 bg-white border-t border-gray-200 p-1 flex flex-col justify-center text-center relative z-10">
                            <span className="text-[9px] font-bold text-gray-800 leading-tight line-clamp-1">{item.name}</span>
                            <span className="text-[9px] font-mono text-gray-500 font-bold">{item.price.toLocaleString()}</span>
                        </div>

                        {/* Delete Button */}
                        {editMode && (
                            <button onClick={(e) => handleDelete(e, item.id!)} className="absolute top-0 right-0 bg-red-600 text-white p-1 hover:bg-red-800 z-20">
                                <Trash2 size={10} />
                            </button>
                        )}
                    </div>
                ))}

                {/* ADD BUTTON */}
                {editMode && (
                    <button
                        onClick={() => setIsAddOpen(true)}
                        className="aspect-square border-2 border-dashed border-gray-400 flex flex-col items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 hover:border-black"
                    >
                        <Plus size={24} />
                        <span className="text-[10px] font-bold uppercase mt-1">
                            {t("sale_ticket.catalog.add_item")}
                        </span>
                    </button>
                )}
            </div>

            {/* --- ADD NEW ITEM MODAL --- */}
            {isAddOpen && (
                <div className="absolute inset-0 bg-white z-50 p-3 flex flex-col animate-in fade-in">
                    <h3 className="font-bold text-xs uppercase border-b pb-2 mb-2">
                        {t("sale_ticket.catalog.modal_new_item")}
                    </h3>

                    <form onSubmit={handleSaveItem} className="flex flex-col gap-2 flex-1 overflow-y-auto">
                        {/* Image */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="h-16 border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 relative shrink-0"
                        >
                            {newItem.image ? (
                                <img src={newItem.image} className="h-full w-full object-contain" />
                            ) : (
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                    <ImageIcon size={14} /> {t("sale_ticket.catalog.upload_image")}
                                </span>
                            )}
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </div>

                        {/* Name */}
                        <div>
                            <label className="text-[9px] font-bold uppercase text-gray-500">{t("sale_ticket.catalog.label_name")}</label>
                            <input required className="w-full h-8 border border-gray-400 px-2 text-sm outline-none focus:border-blue-600"
                                value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                placeholder={t("sale_ticket.catalog.label_name")} />
                        </div>

                        {/* Barcode */}
                        <div>
                            <label className="text-[9px] font-bold uppercase text-gray-500">{t("sale_ticket.catalog.label_barcode")}</label>
                            <div className="flex gap-1">
                                <input required className="flex-1 h-8 border border-gray-400 px-2 text-sm font-mono outline-none focus:border-blue-600"
                                    value={newItem.barcode} onChange={e => setNewItem({ ...newItem, barcode: e.target.value })}
                                    placeholder={t("sale_ticket.topbar.scan_placeholder")} />
                                <div className="bg-gray-200 px-2 flex items-center border border-gray-400"><Tag size={14} /></div>
                            </div>
                        </div>

                        {/* Unit Type Selection */}
                        <div>
                            <label className="text-[9px] font-bold uppercase text-gray-500">{t("sale_ticket.catalog.label_unit")}</label>
                            <div className="flex gap-1 bg-gray-100 p-1 border border-gray-300">
                                <button type="button" onClick={() => setNewItem({ ...newItem, unitType: "single" })} className={`flex-1 py-1 text-[10px] font-bold uppercase border ${newItem.unitType === "single" ? "bg-black text-white border-black" : "bg-white text-gray-500 border-gray-300"}`}>
                                    {t("sale_ticket.topbar.unit_single")}
                                </button>
                                <button type="button" onClick={() => setNewItem({ ...newItem, unitType: "packet" })} className={`flex-1 py-1 text-[10px] font-bold uppercase border ${newItem.unitType === "packet" ? "bg-black text-white border-black" : "bg-white text-gray-500 border-gray-300"}`}>
                                    {t("sale_ticket.topbar.unit_packet")}
                                </button>
                                <button type="button" onClick={() => setNewItem({ ...newItem, unitType: "wholesale" })} className={`flex-1 py-1 text-[10px] font-bold uppercase border ${newItem.unitType === "wholesale" ? "bg-black text-white border-black" : "bg-white text-gray-500 border-gray-300"}`}>
                                    {t("sale_ticket.topbar.unit_wholesale")}
                                </button>
                            </div>
                        </div>

                        {/* --- NEW: DEFAULT QUANTITY FIELD --- */}
                        <div>
                            <label className="text-[9px] font-bold uppercase text-gray-500 flex items-center gap-1">
                                <Scale size={10} />
                                {t("sale_ticket.catalog.label_default_qty") || "Default Quantity (Increment)"}
                            </label>
                            <input
                                required
                                type="number"
                                step="any" // Allows 0.5, 0.25 etc
                                className="w-full h-8 border border-gray-400 px-2 text-sm font-bold text-blue-800 outline-none focus:border-blue-600"
                                value={newItem.defaultQuantity}
                                onChange={e => setNewItem({ ...newItem, defaultQuantity: e.target.value })}
                                placeholder="1"
                            />
                            <p className="text-[8px] text-gray-400 mt-0.5">
                                * Value added per click (e.g. 0.5 for half kg)
                            </p>
                        </div>

                        {/* Price */}
                        <div>
                            <label className="text-[9px] font-bold uppercase text-gray-500">{t("sale_ticket.catalog.label_price")}</label>
                            <input required type="number" step="any" className="w-full h-8 border border-gray-400 px-2 text-sm outline-none focus:border-blue-600"
                                value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} placeholder="0" />
                        </div>

                        <div className="mt-auto flex gap-2">
                            <button type="button" onClick={() => setIsAddOpen(false)} className="flex-1 h-8 bg-gray-200 text-xs font-bold border border-gray-400 hover:bg-gray-300">
                                {t("sale_ticket.catalog.btn_cancel")}
                            </button>
                            <button type="submit" className="flex-1 h-8 bg-black text-white text-xs font-bold border border-black hover:bg-gray-800">
                                {t("sale_ticket.catalog.btn_save")}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}