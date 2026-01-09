"use client";
import { SaleDetail } from "@/lib/api/sales-history";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props { items: SaleDetail['items']; }

export default function InstallmentTable({ items }: Props) {
    const { t } = useSettings();
    return (
        <div className="border border-blue-300 bg-white mb-2 font-sans shadow-sm">
            <table className="w-full text-left border-collapse">
                {/* Blue Header for Installments */}
                <thead className="bg-blue-600 border-b border-blue-800 text-xs uppercase font-bold text-white">
                    <tr>
                        <th className="p-3 border-r border-blue-500 w-12 text-center">#</th>
                        <th className="p-3 border-r border-blue-500">{t("sales_history.detail.items_desc")}</th>
                        <th className="p-3 border-r border-blue-500 text-center w-20">{t("sales_history.detail.unit")}</th>
                        <th className="p-3 border-r border-blue-500 text-center w-16">{t("sales_history.detail.qty")}</th>
                        <th className="p-3 text-right w-32">Total Value</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-blue-100 text-sm">
                    {items.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-blue-50 transition-colors">
                            <td className="p-3 border-r border-blue-100 text-center text-gray-500 text-xs">{idx + 1}</td>
                            <td className="p-3 border-r border-blue-100 font-bold text-gray-800">{item.item_name}</td>
                            <td className="p-3 border-r border-blue-100 text-center text-xs uppercase">{item.unit_type}</td>
                            <td className="p-3 border-r border-blue-100 text-center font-bold bg-blue-50">{item.quantity}</td>
                            <td className="p-3 text-right font-bold font-mono text-blue-900">{item.subtotal.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}