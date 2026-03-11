"use client";

import { useState } from "react";
import { addReturnItem, getReturnDetails, ReturnDetail } from "@/lib/api/returns";
import { getItemByBarcode } from "@/lib/api/items";
import { useSettings } from "@/lib/contexts/SettingsContext";

// Local Components
import ReturnHeader from "./components/ReturnHeader";
import ReturnSidebar from "./components/ReturnSidebar";
import ReturnTable from "./components/ReturnTable";
import ReturnFooter from "./components/ReturnFooter";

export default function CreateReturnPage() {
    const { t } = useSettings();

    // State
    const [returnId, setReturnId] = useState<number>(0);
    const [details, setDetails] = useState<ReturnDetail | null>(null);
    const [loading, setLoading] = useState(false);

    const refreshDetails = async (id: number) => {
        const data = await getReturnDetails(id);
        setDetails(data);
    };

    // Main Logic
    const handleAddItem = async (barcode: string, selectedUnit: string, qty: number, restock: boolean) => {
        if (!barcode) return;
        setLoading(true);

        try {
            // 1. Fetch Item details first
            const item = await getItemByBarcode(barcode);

            if (!item) {
                alert(t("returns.alerts.not_found"));
                setLoading(false);
                return;
            }

            // 2. Logic to determine Unit Type
            // If user selected "single", but item is actually kg/m/cm, we force that type.
            let unitToSend = selectedUnit;
            if (selectedUnit === "single") {
                if (["kg", "m", "cm", "liter"].includes(item.unit_type)) {
                    unitToSend = item.unit_type;
                }
            }

            // 3. Get User
            const userStr = localStorage.getItem("pos_user");
            const userId = userStr ? JSON.parse(userStr).id : 1;

            // 4. Add to Return API
            const result = await addReturnItem(returnId, {
                user_id: userId,
                item_id: item.id,
                unit_type: unitToSend,
                quantity: qty,
                restock: restock
            });

            if (result && result.return_id) {
                if (returnId === 0) setReturnId(result.return_id);
                await refreshDetails(result.return_id);
            } else {
                alert(t("returns.alerts.fail_add"));
            }
        } catch (err) {
            console.error(err);
            alert(t("returns.alerts.error"));
        }
        setLoading(false);
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100 font-sans">
            <ReturnHeader returnId={returnId} />
            <div className="flex-1 flex overflow-hidden p-2 gap-2">
                <ReturnSidebar
                    onAdd={handleAddItem}
                    loading={loading}
                />
                <div className="flex-1 flex flex-col bg-white border border-gray-400">
                    <ReturnTable items={details?.items || []} />
                    <ReturnFooter
                        itemCount={(details?.items || []).length}
                        totalAmount={details?.return_info?.total_refund || 0}
                    />
                </div>
            </div>
        </div>
    );
}