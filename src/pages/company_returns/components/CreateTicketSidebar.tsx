"use client";
import { useState, useEffect } from "react";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { getCompanies, Company } from "@/lib/api/companies"; // Assuming you have this

interface Props {
    onSubmit: (data: any) => Promise<void>;
}

export default function CreateTicketSidebar({ onSubmit }: Props) {
    const { t } = useSettings();
    const [companies, setCompanies] = useState<Company[]>([]);

    // Form State
    const [companyId, setCompanyId] = useState("");
    const [deduct, setDeduct] = useState(true);
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Load companies for dropdown
        getCompanies("", 1, 100).then(res => {
            if (res) setCompanies(res.data);
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!companyId) return;

        setLoading(true);
        await onSubmit({
            company_id: Number(companyId),
            user_id: 1, // Default user, or get from session
            deduct_from_balance: deduct,
            note: note
        });

        // Reset
        setCompanyId("");
        setNote("");
        setDeduct(true);
        setLoading(false);
    };

    return (
        <div className="bg-white border border-gray-400 p-2 flex flex-col gap-4 h-fit w-[300px] shrink-0">
            <div className="bg-gray-50 border border-gray-200 p-3">
                <h3 className="text-xs font-bold uppercase text-gray-500 mb-4 border-b border-gray-300 pb-2">
                    {t("company_return.actions.create")}
                </h3>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">

                    {/* Company Select */}
                    <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">
                            {t("company_return.form.select_company")}
                        </label>
                        <select
                            required
                            value={companyId}
                            onChange={e => setCompanyId(e.target.value)}
                            className="w-full h-9 border border-gray-400 px-2 text-sm bg-white rounded-none outline-none focus:border-blue-600"
                        >
                            <option value="">-- Select --</option>
                            {companies.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Deduct Checkbox */}
                    <div className="flex items-center gap-2 bg-white border border-gray-300 p-2">
                        <input
                            type="checkbox"
                            id="deduct"
                            checked={deduct}
                            onChange={e => setDeduct(e.target.checked)}
                            className="w-4 h-4 rounded-none accent-blue-600"
                        />
                        <label htmlFor="deduct" className="text-xs font-bold uppercase text-gray-700 cursor-pointer select-none">
                            {t("company_return.form.deduct")}
                        </label>
                    </div>

                    {/* Note */}
                    <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">
                            {t("company_return.form.note")}
                        </label>
                        <textarea
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            rows={3}
                            placeholder={t("company_return.form.note_placeholder")}
                            className="w-full border border-gray-400 p-2 text-sm rounded-none outline-none focus:border-blue-600 resize-none"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-10 bg-blue-700 text-white font-bold uppercase text-sm hover:bg-blue-800 disabled:opacity-50 mt-2"
                    >
                        {loading ? "..." : t("company_return.form.create_btn")}
                    </button>
                </form>
            </div>
        </div>
    );
}