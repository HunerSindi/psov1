"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { openTicket, SaleResponse } from "@/lib/api/sale-ticket";
import { sendReceiptToPrinter } from "@/lib/utils/printerService";

// Components
import TicketSelector from "./components/TicketSelector";
import TopBar, { TopBarRef } from "./components/TopBar";
import ItemTable from "./components/ItemTable";
import TotalsSection from "./components/TotalsSection";
import SaleCartHeader from "./components/SaleCartHeader";
import LocalCatalog from "./components/catalog/LocalCatalog";

// Print Components
import PrintCashA4 from "./components/print/PrintCash";
import PrintCashPOS, { POS_RECEIPT_ID } from "./components/print/PrintCashPOS"; // <--- IMPORT 2
import PrintLoan from "./components/print/PrintLoan";
import PrintInstallment from "./components/print/PrintInstallment";
import PrintLoanPOS, { POS_LOAN_ID } from "./components/print/PrintLoanPOS";

export default function SaleTicketPage() {
  const topBarRef = useRef<TopBarRef>(null);
  const [currentTicket, setCurrentTicket] = useState(1);
  const [saleData, setSaleData] = useState<SaleResponse | null>(null);
  const [printData, setPrintData] = useState<SaleResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const refocusBarcode = useCallback(() => {
    topBarRef.current?.focusBarcode?.();
  }, []);

  // Hardcoded for now, or get from localStorage
  const PRINTER_IP = "192.168.123.100";

  const refreshTicket = useCallback(
    async (ticketNum: number = currentTicket) => {
      setLoading(true);

      // 1. Get the user string from Local Storage
      const userStr = localStorage.getItem("pos_user");
      let userId = 0;
      // 2. Parse the JSON string to get the ID
      if (userStr) {
        const userData = JSON.parse(userStr);
        userId = userData.id; // This gets "2" from your example
      }
      // 3. Pass the dynamic User ID to openTicket
      const data = await openTicket(ticketNum, userId);

      if (data) setSaleData(data);
      setLoading(false);
    },
    [currentTicket]
  );

  useEffect(() => {
    refreshTicket(currentTicket);
  }, [currentTicket, refreshTicket]);

  // --- MODIFIED PRINT HANDLER ---
  // app/sale-ticket/page.tsx

  const handlePrintRequest = async (
    mode: "cash-a4" | "cash-pos" | "loan" | "loan-pos" | "install"
  ) => {
    // 1. Reset all classes first
    document.body.classList.remove(
      "mode-cash-a4",
      "mode-cash-pos",
      "mode-loan",
      "mode-install"
    );

    // 2. Handle POS (Backend) - No browser print dialog
    if (mode === "cash-pos" || mode === "loan-pos") {
      const elementId =
        mode === "cash-pos"
          ? "pos-receipt-template-hidden"
          : "pos-receipt-template-hidden";
      // Note: Since I reused the same ID const in both files, you must ensure they have UNIQUE IDs.
      // Change ID in PrintLoanPOS.tsx to "pos-loan-template-hidden"

      // Let's assume you changed it:
      const targetId =
        mode === "cash-pos"
          ? "pos-receipt-template-hidden"
          : "pos-loan-template-hidden";

      setTimeout(async () => {
        await sendReceiptToPrinter(targetId);
      }, 100);
      return;
    }

    // 3. Add specific class for Browser Print
    if (mode === "cash-a4") document.body.classList.add("mode-cash-a4");
    if (mode === "loan") document.body.classList.add("mode-loan");
    if (mode === "install") document.body.classList.add("mode-install");

    // 4. Trigger Browser Print
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden font-sans">
      {/* VISIBLE UI */}
      <div className="flex flex-col h-full print:hidden">
        <div>
          <SaleCartHeader />
          <div className="bg-white border-b border-gray-400 p-1 shadow-none z-10">
            <TopBar ref={topBarRef} saleData={saleData} onRefresh={() => refreshTicket()} />
          </div>
        </div>

        <div className="flex-1 flex flex-row p-1 gap-1 overflow-hidden">
          <div className="w-14 flex-shrink-0 border border-gray-400 bg-white">
            <TicketSelector
              current={currentTicket}
              onSelect={setCurrentTicket}
            />
          </div>

          <div className="flex-1 max-w-[45%] flex flex-col gap-1 h-full min-h-0">
            <div className="flex-1 bg-white border border-gray-400 relative flex flex-col min-h-0 overflow-hidden">
              {loading && (
                <div className="absolute inset-0 bg-white/50 z-20 flex items-center justify-center">
                  <span className="text-black font-bold text-sm uppercase tracking-widest">
                    Processing...
                  </span>
                </div>
              )}
              <ItemTable
                saleData={saleData}
                onRefresh={() => refreshTicket()}

              />
            </div>
            <div className="bg-white border border-gray-400 p-1 h-fit shrink-0">
              <TotalsSection
                saleData={saleData}
                onRefresh={() => refreshTicket()}
                onPrintRequest={handlePrintRequest}
                onPaymentSuccess={(snapshot) => setPrintData(snapshot)}
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-1 bg-white border border-gray-400 p-0 h-full shadow-sm">
            <LocalCatalog
              saleId={saleData?.receipt.id}
              onRefresh={() => { refreshTicket(); refocusBarcode(); }}
              onRefocusBarcode={refocusBarcode}
              ticketTotalIqd={saleData?.receipt.final_amount ?? 0}
            />
          </div>
        </div>
      </div>

      {/* PRINT COMPONENTS */}
      {printData && (
        <>
          {/* Browser Print Components */}
          <PrintCashA4 data={printData} />
          <PrintLoan data={printData} />
          <PrintInstallment data={printData} />

          {/* Backend Print Component (Always Hidden/Offscreen) */}
          <PrintCashPOS data={printData} />
          <PrintLoanPOS data={printData} />
        </>
      )}
    </div>
  );
}
