"use client";
import { useEffect, useState } from "react";
import { getCustomers, createCustomer, updateCustomer, deleteCustomer, updateCustomerBalance, Customer } from "@/lib/api/customers";
import { Printer, Plus } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext"; // Hook

// Components
import CustomerHeader from "./components/CustomerHeader";
import CustomerFilter from "./components/CustomerFilter";
import CustomerTable from "./components/CustomerTable";
import CustomerFormDialog from "./components/CustomerFormDialog";
import CustomerPayDialog from "./components/CustomerPayDialog";
import PrintCustomerList from "./components/PrintCustomerList";

export default function CustomerPage() {
    const { t } = useSettings(); // Hook

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [search, setSearch] = useState("");
    const [minBal, setMin] = useState("");
    const [maxBal, setMax] = useState("");
    const [sort, setSort] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Modals
    const [selected, setSelected] = useState<Customer | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isPayOpen, setIsPayOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => loadData(), 300);
        return () => clearTimeout(timer);
    }, [search, minBal, maxBal, sort, page]);

    const loadData = async () => {
        setLoading(true);
        const res = await getCustomers(search, page, 15, minBal, maxBal, sort);
        if (res) {
            setCustomers(res.data);
            setTotalPages(Math.ceil(res.meta.total / res.meta.limit));
        }
        setLoading(false);
    };

    const handleFormSubmit = async (data: Customer) => {
        if (selected?.id) await updateCustomer(selected.id, data);
        else await createCustomer(data);
        setIsFormOpen(false); loadData();
    };

    const handlePaySubmit = async (amount: number, desc: string) => {
        if (selected?.id) await updateCustomerBalance(selected.id, amount, desc);
        setIsPayOpen(false); loadData();
    };

    const handleDelete = async (id: number) => {
        if (confirm(t("customer.dialogs.delete_confirm"))) {
            await deleteCustomer(id);
            loadData();
        }
    };

    return (
        <div className="h-screen flex flex-col bg-white font-sans overflow-hidden">
            <div className="print:hidden"><CustomerHeader /></div>
            <div className="flex-1 flex overflow-hidden p-2 gap-2 print:hidden">
                <div className="flex-[4] flex flex-col h-full overflow-hidden">
                    <CustomerFilter
                        search={search} onSearchChange={s => { setSearch(s); setPage(1) }}
                        minBal={minBal} onMinChange={setMin}
                        maxBal={maxBal} onMaxChange={setMax}
                        sort={sort} onSortChange={setSort}
                    />
                    <div className="flex-1 overflow-hidden mt-2">
                        <CustomerTable
                            customers={customers} loading={loading} page={page} totalPages={totalPages} onPageChange={setPage}
                            onEdit={c => { setSelected(c); setIsFormOpen(true) }}
                            onPay={c => { setSelected(c); setIsPayOpen(true) }}
                            onDelete={handleDelete}
                        />
                    </div>
                </div>
                <div className="flex-1 bg-white border border-gray-400 p-2 flex flex-col gap-4 h-fit">
                    <div className="bg-gray-50 border border-gray-200 p-3 text-center">
                        <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">
                            {t("customer.actions.sidebar_title")}
                        </h3>
                        <button onClick={() => { setSelected(null); setIsFormOpen(true) }} className="w-full flex items-center justify-center gap-2 bg-blue-700 text-white py-3 font-bold hover:bg-blue-800 border border-blue-900 mb-2">
                            <Plus size={18} /> {t("customer.actions.new_customer")}
                        </button>
                        <button onClick={() => window.print()} className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 font-bold hover:bg-gray-800 border border-black">
                            <Printer size={18} /> {t("customer.actions.print_list")}
                        </button>
                    </div>
                </div>
            </div>

            <PrintCustomerList customers={customers} />

            <CustomerFormDialog isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} initialData={selected} isEditing={!!selected?.id} />
            <CustomerPayDialog isOpen={isPayOpen} onClose={() => setIsPayOpen(false)} onSubmit={handlePaySubmit} customer={selected} />
        </div>
    );
}