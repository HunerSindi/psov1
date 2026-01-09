"use client";

import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, LocalCategory } from "@/lib/local-db";
import { Plus, Trash2 } from "lucide-react";

interface Props {
    onSelect: (id: number, name: string) => void;
    editMode: boolean;
}

export default function LocalCategoryGrid({ onSelect, editMode }: Props) {
    // Live query automatically updates UI when DB changes
    const categories = useLiveQuery(() => db.categories.toArray());

    const handleAdd = async () => {
        const name = prompt("Enter Category Name (e.g. Drinks):");
        if (name) {
            await db.categories.add({ name, color: "bg-gray-100" });
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (confirm("Delete this category and all its shortcuts?")) {
            await db.categories.delete(id);
            // Also delete items in this category
            await db.items.where({ categoryId: id }).delete();
        }
    };

    return (
        <div className="grid grid-cols-3 gap-2 overflow-y-auto max-h-full content-start">
            {categories?.map((cat) => (
                <div
                    key={cat.id}
                    onClick={() => !editMode && onSelect(cat.id!, cat.name)}
                    className={`relative h-24 border border-gray-400 flex items-center justify-center text-center p-1 shadow-sm select-none
                        ${editMode ? "bg-yellow-50 border-dashed cursor-default" : "bg-gray-100 hover:bg-blue-100 cursor-pointer active:scale-95 transition-transform"}
                    `}
                >
                    <span className="font-bold text-xs uppercase text-gray-700 break-words w-full px-1">
                        {cat.name}
                    </span>

                    {/* Delete Button (Only in Edit Mode) */}
                    {editMode && (
                        <button
                            onClick={(e) => handleDelete(e, cat.id!)}
                            className="absolute top-1 right-1 text-red-500 hover:text-red-700 bg-white rounded-full p-1 border border-gray-300"
                        >
                            <Trash2 size={12} />
                        </button>
                    )}
                </div>
            ))}

            {/* Add Button */}
            <button
                onClick={handleAdd}
                className="h-24 border-2 border-dashed border-gray-400 flex flex-col items-center justify-center text-gray-400 hover:text-black hover:border-black hover:bg-gray-50 transition-colors"
            >
                <Plus size={24} />
                <span className="text-[10px] font-bold uppercase mt-1">Add Cat</span>
            </button>
        </div>
    );
}