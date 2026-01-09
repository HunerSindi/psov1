"use client";
import { useEffect, useState } from "react";
import { getDamagedItems, createDamagedItem, updateDamagedItem, deleteDamagedItem, DamagedItem } from "@/lib/api/damaged_items";
import { Printer, Plus } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext";

// Components
import DamagedHeader from "./components/DamagedHeader";
import DamagedFilter from "./components/DamagedFilter";
import DamagedTable from "./components/DamagedTable";
import DamagedFormDialog from "./components/DamagedFormDialog";
import PrintDamagedList from "./components/PrintDamagedList";

export default function DamagedItemsPage() {
    const { t } = useSettings();

    const [items, setItems] = useState<DamagedItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Modals
    const [selected, setSelected] = useState<DamagedItem | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => loadData(), 300);
        return () => clearTimeout(timer);
    }, [search, startDate, endDate, page]);

    const loadData = async () => {
        setLoading(true);
        const res = await getDamagedItems(search, page, 15, startDate, endDate);
        if (res) {
            setItems(res.data);
            setTotalPages(Math.ceil(res.meta.total_items / res.meta.per_page));
        }
        setLoading(false);
    };

    const handleFormSubmit = async (data: DamagedItem) => {
        if (selected?.id) {
            await updateDamagedItem(selected.id, data);
        } else {
            await createDamagedItem(data);
        }
        setIsFormOpen(false);
        loadData();
    };

    const handleDelete = async (id: number) => {
        if (confirm(t("damaged_items.dialogs.delete_confirm"))) {
            await deleteDamagedItem(id);
            loadData();
        }
    };

    return (
        <div className="h-screen flex flex-col bg-white font-sans overflow-hidden">
            <div className="print:hidden"><DamagedHeader /></div>
            <div className="flex-1 flex overflow-hidden p-2 gap-2 print:hidden">
                <div className="flex-[4] flex flex-col h-full overflow-hidden">
                    <DamagedFilter
                        search={search} onSearchChange={s => { setSearch(s); setPage(1) }}
                        startDate={startDate} onStartChange={setStartDate}
                        endDate={endDate} onEndChange={setEndDate}
                    />
                    <div className="flex-1 overflow-hidden mt-2">
                        <DamagedTable
                            items={items}
                            loading={loading}
                            page={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                            onEdit={item => { setSelected(item); setIsFormOpen(true) }}
                            onDelete={handleDelete}
                        />
                    </div>
                </div>
                <div className="flex-1 bg-white border border-gray-400 p-2 flex flex-col gap-4 h-fit">
                    <div className="bg-gray-50 border border-gray-200 p-3 text-center">
                        <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">
                            {t("damaged_items.actions.sidebar_title")}
                        </h3>
                        <button onClick={() => { setSelected(null); setIsFormOpen(true) }} className="w-full flex items-center justify-center gap-2 bg-red-700 text-white py-3 font-bold hover:bg-red-800 border border-red-900 mb-2">
                            <Plus size={18} /> {t("damaged_items.actions.new_item")}
                        </button>
                        <button onClick={() => window.print()} className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 font-bold hover:bg-gray-800 border border-black">
                            <Printer size={18} /> {t("damaged_items.actions.print_list")}
                        </button>
                    </div>
                </div>
            </div>

            <PrintDamagedList items={items} />

            <DamagedFormDialog
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={selected}
                isEditing={!!selected?.id}
            />
        </div>
    );
}