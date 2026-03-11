"use client";

import { db, LocalCategory } from "@/lib/local-db";
import { Plus, Trash2 } from "lucide-react";

interface Props {
    categories: LocalCategory[];
    selectedId: number | null;
    onSelect: (id: number) => void;
    editMode: boolean;
}

export default function LocalCategorySidebar({ categories, selectedId, onSelect, editMode }: Props) {

    const handleAdd = async () => {
        const name = prompt("New Category Name:");
        if (name) {
            await db.categories.add({ name });
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (confirm("Delete category and all its items?")) {
            await db.categories.delete(id);
            await db.items.where({ categoryId: id }).delete();
        }
    };

    return (
        <div className="flex flex-col h-full overflow-y-auto gap-1 p-1">
            {categories.map((cat) => (
                <div
                    key={cat.id}
                    onClick={() => onSelect(cat.id!)}
                    className={`
                        relative w-full h-16 flex items-center justify-center text-center p-1 border cursor-pointer select-none transition-colors
                        ${selectedId === cat.id
                            ? "bg-blue-600 text-white border-blue-800 font-bold shadow-md"
                            : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                        }
                    `}
                >
                    <span className="text-[10px] uppercase leading-tight break-words">
                        {cat.name}
                    </span>

                    {editMode && (
                        <button
                            onClick={(e) => handleDelete(e, cat.id!)}
                            className="absolute top-0 right-0 bg-red-600 text-white p-0.5 z-10 hover:bg-red-800"
                        >
                            <Trash2 size={10} />
                        </button>
                    )}
                </div>
            ))}

            {/* ADD BUTTON (Only visible in edit mode) */}
            {editMode && (
                <button
                    onClick={handleAdd}
                    className="w-full h-12 flex flex-col items-center justify-center border-2 border-dashed border-gray-400 text-gray-400 hover:text-black hover:border-black shrink-0"
                >
                    <Plus size={16} />
                    <span className="text-[8px] font-bold uppercase">Add Cat</span>
                </button>
            )}
        </div>
    );
}