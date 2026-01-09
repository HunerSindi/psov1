"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getSaleDetail, SaleDetail } from "@/lib/api/sales-history";
import { Printer, Receipt } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext";

// Local UI
import DetailHeader from "./components/DetailHeader";
import InvoiceInfo from "./components/InvoiceInfo";

// --- IMPORT TABLES ---
import CashTable from "./components/tables/CashTable";
import LoanTable from "./components/tables/LoanTable";
import InstallmentTable from "./components/tables/InstallmentTable";

// --- IMPORT TOTALS ---
import CashTotals from "./components/totals/CashTotals";
import LoanTotals from "./components/totals/LoanTotals";
import InstallmentTotals from "./components/totals/InstallmentTotals";

// --- IMPORT INFO HEADERS ---
import CashInfo from "./components/info/CashInfo";
import LoanInfo from "./components/info/LoanInfo";

// --- PRINT COMPONENTS ---
import PrintCashA4 from "@/app/sale-ticket/components/print/PrintCash";
import PrintCashPOS from "@/app/sale-ticket/components/print/PrintCashPOS";
import PrintLoan from "@/app/sale-ticket/components/print/PrintLoan";
import PrintLoanPOS from "@/app/sale-ticket/components/print/PrintLoanPOS";
import PrintInstallment from "@/app/sale-ticket/components/print/PrintInstallment";

export default function SaleDetailPage() {
    const { id } = useParams();
    const { t } = useSettings();

    const [sale, setSale] = useState<SaleDetail | null>(null);
    const [loading, setLoading] = useState(true);

    // We use this to mount the print component
    const [printView, setPrintView] = useState<"a4" | "pos" | null>(null);

    useEffect(() => {
        if (id) loadData(Number(id));
    }, [id]);

    const loadData = async (saleId: number) => {
        setLoading(true);
        const data = await getSaleDetail(saleId);
        setSale(data);
        setLoading(false);
    };

    const handlePrint = (view: "a4" | "pos") => {
        if (!sale) return;

        const type = sale.receipt.payment_type; // 'cash' | 'loan' | 'installment'

        // 1. Determine the Body Class needed for CSS to show the component
        let modeClass = "";

        if (view === "a4") {
            if (type === "cash") modeClass = "mode-cash-a4";
            if (type === "loan") modeClass = "mode-loan";
            if (type === "installment") modeClass = "mode-install";
        } else {
            // POS
            if (type === "cash") modeClass = "mode-cash-pos";
            if (type === "loan") modeClass = "mode-loan-pos"; // or reuse cash-pos if styling is same
        }

        // 2. Clean up old classes and Add new one
        document.body.classList.remove("mode-cash-a4", "mode-cash-pos", "mode-loan", "mode-loan-pos", "mode-install");
        if (modeClass) document.body.classList.add(modeClass);

        // 3. Mount the component via State
        setPrintView(view);

        // 4. Trigger Print after small delay to allow React to render
        setTimeout(() => {
            window.print();
        }, 200);
    };

    if (loading) return <div className="p-10 text-center uppercase font-bold text-gray-400">Loading...</div>;
    if (!sale) return <div className="p-10 text-center uppercase font-bold text-red-400">Not Found</div>;

    const { receipt, items } = sale;
    const paymentType = receipt.payment_type;
    const printData = sale as any; // Cast for print props

    return (
        <div className="h-screen flex flex-col bg-white font-sans overflow-hidden">

            {/* MAIN UI (Hidden during print) */}
            <div className="flex flex-col h-full print:hidden">
                <DetailHeader />

                <div className="flex-1 flex overflow-hidden p-2 gap-2">
                    {/* Left: Invoice Content */}
                    <div className="flex-[4] overflow-y-auto">
                        <div className="mx-auto bg-white p-4 border border-gray-400 shadow-sm min-h-full">

                            {/* 1. INFO SECTION */}
                            {paymentType === 'cash' && <CashInfo receipt={receipt} />}
                            {paymentType === 'loan' && <LoanInfo receipt={receipt} />}
                            {paymentType === 'installment' && <InvoiceInfo receipt={receipt} />}

                            {/* 2. TABLE SECTION */}
                            {paymentType === 'cash' && <CashTable items={items} />}
                            {paymentType === 'loan' && <LoanTable items={items} />}
                            {paymentType === 'installment' && <InstallmentTable items={items} />}

                            {/* 3. TOTALS SECTION */}
                            <div className="mt-4">
                                {paymentType === 'cash' && <CashTotals receipt={receipt} />}
                                {paymentType === 'loan' && <LoanTotals receipt={receipt} />}
                                {paymentType === 'installment' && <InstallmentTotals receipt={receipt} />}
                            </div>

                        </div>
                    </div>

                    {/* Right: Sidebar Actions */}
                    <div className="flex-1 bg-white border border-gray-400 p-2 flex flex-col gap-4 h-fit">
                        <div className="bg-gray-50 border border-gray-200 p-3 text-center flex flex-col gap-2">
                            <h3 className="text-xs font-bold uppercase text-gray-500 mb-1">
                                {t("sales_history.detail.actions")}
                            </h3>

                            <button
                                onClick={() => handlePrint("a4")}
                                className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 font-bold hover:bg-gray-800 border border-black transition-colors"
                            >
                                <Printer size={18} />
                                {t("sales_history.detail.print_invoice")} (A4)
                            </button>

                            {/* Only show POS button for Cash/Loan if needed */}
                            {paymentType !== "installment" && (
                                <button
                                    onClick={() => handlePrint("pos")}
                                    className="w-full flex items-center justify-center gap-2 bg-blue-700 text-white py-3 font-bold hover:bg-blue-800 border border-blue-900 transition-colors"
                                >
                                    <Receipt size={18} />
                                    {t("sales_history.detail.print_pos")}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- HIDDEN PRINT AREA --- */}
            {/* The body class added in handlePrint makes the specific child visible via CSS */}

            {printView === "a4" && (
                <>
                    {paymentType === "cash" && <PrintCashA4 data={printData} />}
                    {paymentType === "loan" && <PrintLoan data={printData} />}
                    {paymentType === "installment" && <PrintInstallment data={printData} />}
                </>
            )}

            {printView === "pos" && (
                <>
                    {paymentType === "cash" && <PrintCashPOS data={printData} />}
                    {/* If you have PrintLoanPOS, uncomment below */}
                    {paymentType === "loan" && <PrintLoanPOS data={printData} />}
                </>
            )}

        </div>
    );
}