import React from "react";
import { SaleDetail } from "@/lib/api/sales-history";

interface Props {
    data: SaleDetail;
}

export default function PrintInvoicePOS({ data }: Props) {
    const { receipt, items } = data;

    return (
        <div className="hidden print-pos:block fixed inset-0 bg-white z-[9999] p-0 m-0 font-mono text-black leading-tight print:hidden">

            {/* 80mm Container */}
            <div className="w-[80mm] mx-auto pb-10">

                {/* POS Header */}
                <div className="text-center mb-2 border-b border-black border-dashed pb-2">
                    <h1 className="text-lg font-bold uppercase">My Shop Name</h1>
                    <p className="text-[10px]">Address Line 1, City</p>
                    <p className="text-[10px]">Tel: 123-456-7890</p>
                </div>

                {/* Info */}
                <div className="flex justify-between text-[10px] mb-2">
                    <div>
                        <p>Ticket: <b>#{receipt.ticket_number}</b></p>
                        <p>Date: {new Date(receipt.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                        <p>Cashier: {receipt.user_name}</p>
                        <p>Time: {new Date(receipt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                </div>

                {/* Separator */}
                <div className="border-b border-black mb-1"></div>

                {/* Items Header */}
                <div className="flex text-[10px] font-bold uppercase mb-1">
                    <div className="flex-1">Item</div>
                    <div className="w-8 text-center">Qty</div>
                    <div className="w-12 text-right">Price</div>
                    <div className="w-14 text-right">Total</div>
                </div>

                {/* Items List */}
                <div className="flex flex-col gap-1 mb-2">
                    {items.map((item) => (
                        <div key={item.id} className="text-[10px]">
                            <div className="font-bold">{item.item_name}</div>
                            <div className="flex">
                                <div className="flex-1"></div>
                                <div className="w-8 text-center">{item.quantity}</div>
                                <div className="w-12 text-right">{item.price}</div>
                                <div className="w-14 text-right font-bold">{item.subtotal}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Separator */}
                <div className="border-b border-black border-dashed my-2"></div>

                {/* Totals */}
                <div className="flex justify-end text-[12px] font-bold">
                    <div className="w-full space-y-1">
                        <div className="flex justify-between">
                            <span>Total:</span>
                            <span>{receipt.total_amount.toLocaleString()}</span>
                        </div>
                        {receipt.discount_value > 0 && (
                            <div className="flex justify-between">
                                <span>Disc:</span>
                                <span>-{receipt.discount_value.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-[14px] border-t border-black pt-1 mt-1">
                            <span>NET:</span>
                            <span>{receipt.final_amount.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-[10px] mt-4">
                    <p>Thank you for visiting!</p>
                    <p>*** Customer Copy ***</p>
                </div>

            </div>

            {/* CSS specific for POS */}
            <style>{`
                @media print {
                    body.print-mode-pos .print-pos\\:block { display: block !important; }
                    body.print-mode-pos .print-a4\\:block { display: none !important; }
                    body.print-mode-pos > *:not(.print-pos\\:block) { display: none !important; }
                    
                    /* Reset margins for thermal printer */
                    @page { margin: 0; size: auto; } 
                }
            `}</style>
        </div>
    );
}