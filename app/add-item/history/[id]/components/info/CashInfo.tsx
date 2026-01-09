"use client";

import { SaleDetail } from "@/lib/api/sales-history";
import { useSettings } from "@/lib/contexts/SettingsContext";

interface Props {
    receipt: SaleDetail['receipt'];
}

export default function CashInfo({ receipt }: Props) {
    const { t } = useSettings();

    return (
        <div className="font-sans text-black bg-white mb-2">


            {/* 2. Invoice Details */}
            <div className="flex justify-between items-end border-b border-black pb-2 px-1">
                <div>
                    <h1 className="text-xl font-bold uppercase">
                        {t("sale_ticket.header.title")} #{receipt.id}
                    </h1>
                    <div className="text-xs mt-1">
                        {t("sale_ticket.totals.label_date")}: <b>{new Date(receipt.date).toLocaleString()}</b>
                    </div>
                </div>
                <div className="text-right text-xs space-y-1">
                    <div>
                        {t("sale_ticket.totals.label_customer")}: <b>{receipt.customer_name || t("sale_ticket.topbar.guest_customer")}</b>
                    </div>
                    <div>
                        {t("sale_ticket.totals.label_ticket_id")}: <b>#{receipt.id}</b>
                    </div>
                </div>
            </div>
        </div>
    );
}