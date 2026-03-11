"use client";

import { SaleDetail } from "@/lib/api/sales-history";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    items: SaleDetail['items'];
}

export default function InvoiceTable({ items }: Props) {
    const { t } = useSettings();

    return (
        <div className="border border-gray-400 bg-white mb-2 font-sans">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-200 border-b border-gray-400 text-xs uppercase font-bold text-gray-700">
                    <tr>
                        <th className="p-2 border-r border-gray-400 w-12 text-center">#</th>
                        <th className="p-2 border-r border-gray-400">{t("sales_history.detail.items_desc")}</th>
                        <th className="p-2 border-r border-gray-400 text-center w-20">{t("sales_history.detail.unit")}</th>
                        <th className="p-2 border-r border-gray-400 text-right w-24">{t("sales_history.detail.price")}</th>
                        <th className="p-2 border-r border-gray-400 text-center w-16">{t("sales_history.detail.qty")}</th>
                        <th className="p-2 text-right w-28">{t("sales_history.detail.total")}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                    {items.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-blue-50">
                            <td className="p-2 border-r border-gray-300 text-center text-gray-500 text-xs">{idx + 1}</td>
                            <td className="p-2 border-r border-gray-300 font-medium text-gray-800">{item.item_name}</td>
                            <td className="p-2 border-r border-gray-300 text-center text-xs uppercase">{item.unit_type}</td>
                            <td className="p-2 border-r border-gray-300 text-right font-mono">{item.price.toLocaleString()}</td>
                            <td className="p-2 border-r border-gray-300 text-center font-bold">{item.quantity}</td>
                            <td className="p-2 text-right font-bold font-mono">{item.subtotal.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}