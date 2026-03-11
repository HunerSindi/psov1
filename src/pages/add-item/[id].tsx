"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getReceiptDetails, Receipt, ReceiptItem } from "@/lib/api/receipts";
import ReceiptHeader from "./[id]/components/ReceiptHeader";
import AddItemPanel from "./[id]/components/AddItemPanel/index";
import ReceiptItemsTable from "./[id]/components/ReceiptItemsTable";

export default function ReceiptDetailsPage() {
    const { id } = useParams();

    const [receipt, setReceipt] = useState<Receipt | null>(null);
    const [items, setItems] = useState<ReceiptItem[]>([]);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        if (!id) return;
        const data = await getReceiptDetails(Number(id));
        if (data) {
            setReceipt(data.receipt);
            setItems(data.items || []);
        }
    };

    if (!id) return null;

    return (
        <div className="h-screen bg-gray-100 flex flex-col font-sans overflow-hidden print:bg-white print:h-auto print:overflow-visible">

            {/* Fixed Header */}
            <div className="print:hidden shrink-0">
                <ReceiptHeader receipt={receipt} />
            </div>

            {/* Fixed Scanner Panel */}
            <div className="print:hidden shrink-0">
                <AddItemPanel
                    receiptId={Number(id)}
                    onSuccess={loadData}
                />
            </div>

            {/* Table Area - Takes Remaining Space */}
            {/* flex-1 min-h-0 is crucial here */}
            <div className="flex-1 min-h-0 p-3 print:p-0 print:h-auto print:overflow-visible">
                <ReceiptItemsTable items={items} />
            </div>
        </div>
    );
}