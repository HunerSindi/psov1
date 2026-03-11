import React from "react";
import { SaleDetail } from "@/lib/api/sales-history";

interface Props {
    data: SaleDetail;
}

export default function PrintInvoiceA4({ data }: Props) {
    const { receipt, items } = data;

    return (
        // 1. HIDDEN by default.
        // 2. BLOCK when printing.
        // 3. FIXED inset-0 bg-white: Covers the whole screen so you don't see the buttons behind it.
        <div className="hidden print:block fixed inset-0 w-screen h-screen bg-white z-[9999] top-0 left-0">

            {/* Standard A4 CSS settings */}
            <style>{`
                @media print {
                    @page { size: A4; margin: 10mm; }
                    body { -webkit-print-color-adjust: exact; }
                }
            `}</style>

            <table className="w-full border-collapse font-sans text-black">

                {/* HEADER */}
                <thead>
                    <tr>
                        <th colSpan={5} className="w-full pb-4">
                            {/* Make sure this image path is correct in your public folder */}
                            <img src="/print/header.png" alt="Header" className="w-full h-auto object-contain max-h-[150px]" />
                        </th>
                    </tr>

                    {/* Invoice Details */}
                    <tr>
                        <th colSpan={5} className="text-left pb-4 font-normal">
                            <div className="flex justify-between items-end border-b border-black pb-2">
                                <div>
                                    <h1 className="text-xl font-bold uppercase">Invoice #{receipt.id}</h1>
                                    <div className="text-xs mt-1">Ticket: <b>{receipt.ticket_number}</b></div>
                                </div>
                                <div className="text-right text-xs space-y-1">
                                    <div>Date: <b>{new Date(receipt.date).toLocaleDateString()}</b></div>
                                    <div>Customer: <b>{receipt.customer_name || "Guest"}</b></div>
                                    <div>Cashier: <b>{receipt.user_name}</b></div>
                                </div>
                            </div>
                        </th>
                    </tr>

                    {/* Table Headers */}
                    <tr className="bg-gray-100 border border-black">
                        <th className="p-2 border-r border-black text-center text-[10px] uppercase w-12">#</th>
                        <th className="p-2 border-r border-black text-left text-[10px] uppercase">Description</th>
                        <th className="p-2 border-r border-black text-right text-[10px] uppercase w-24">Price</th>
                        <th className="p-2 border-r border-black text-center text-[10px] uppercase w-16">Qty</th>
                        <th className="p-2 text-right text-[10px] uppercase w-24">Total</th>
                    </tr>
                </thead>

                {/* FOOTER */}
                <tfoot>
                    <tr className="border border-black font-bold bg-gray-50">
                        <td colSpan={4} className="text-right p-2 text-xs uppercase border-r border-black">Total Amount:</td>
                        <td className="text-right p-2 text-xs">{receipt.final_amount.toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td colSpan={5} className="w-full pt-8">
                            <img src="/print/footer.png" alt="Footer" className="w-full h-auto object-contain max-h-[100px]" />
                        </td>
                    </tr>
                </tfoot>

                {/* BODY */}
                <tbody className="text-[10px]">
                    {items.map((item, idx) => (
                        <tr key={item.id} className="border border-black">
                            <td className="p-2 border-r border-black text-center">{idx + 1}</td>
                            <td className="p-2 border-r border-black font-bold">{item.item_name}</td>
                            <td className="p-2 border-r border-black text-right">{item.price.toLocaleString()}</td>
                            <td className="p-2 border-r border-black text-center">{item.quantity}</td>
                            <td className="p-2 text-right font-bold">{item.subtotal.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <style>{`
                @media print {
                    @page { margin: 5mm; size: A4; }
                    body { -webkit-print-color-adjust: exact; }
                }
            `}</style>
        </div>

    );
}