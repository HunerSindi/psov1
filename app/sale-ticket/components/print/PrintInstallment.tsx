import React from "react";
import { SaleResponse } from "@/lib/api/sale-ticket";

export default function PrintInstallment({ data }: { data: SaleResponse }) {
    if (!data) return null;
    const { receipt, items, customer } = data;

    const totalAmount = receipt.final_amount;
    const downPayment = receipt.paid_amount;
    const deferredAmount = totalAmount - downPayment;

    return (
        <div className="print-target-install hidden print:block">


            <div className="p-8 w-full h-full font-sans text-black">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="w-full pb-2">
                                <img src="/print/header.png" alt="Header" className="w-full h-auto object-contain max-h-[150px]" />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="align-top py-4">

                                {/* Title */}
                                <div className="text-center border-b-2 border-black pb-4 mb-6">
                                    <h1 className="text-3xl font-bold uppercase tracking-widest">Installment Agreement</h1>
                                    <p className="text-sm text-gray-600 font-bold uppercase mt-1">Contract #{receipt.id}</p>
                                </div>

                                {/* Contract Parties */}
                                <div className="grid grid-cols-2 gap-8 mb-8">
                                    <div className="border border-gray-400 p-4">
                                        <h3 className="text-xs font-bold uppercase text-gray-500 mb-2 border-b pb-1">Customer (Buyer)</h3>
                                        <p className="font-bold text-lg">{customer?.name}</p>
                                        <p className="text-sm">{customer?.id}</p>
                                    </div>
                                    <div className="border border-gray-400 p-4">
                                        <h3 className="text-xs font-bold uppercase text-gray-500 mb-2 border-b pb-1">Details</h3>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Contract Date:</span>
                                            <span className="font-bold">{new Date().toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Reference:</span>
                                            <span className="font-bold">Ticket #{receipt.id}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Items Table (Simplified) */}
                                <h3 className="text-sm font-bold uppercase mb-2">Purchased Items</h3>
                                <table className="w-full text-left border-collapse mb-8 border border-black">
                                    <thead className="bg-gray-100 border-b border-black">
                                        <tr>
                                            <th className="p-2 text-xs font-bold uppercase">Item Name</th>
                                            <th className="p-2 text-xs font-bold uppercase text-center">Qty</th>
                                            <th className="p-2 text-xs font-bold uppercase text-right">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {items.map((item, idx) => (
                                            <tr key={idx} className="border-b border-gray-200">
                                                <td className="p-2">{item.item_name}</td>
                                                <td className="p-2 text-center">{item.quantity}</td>
                                                <td className="p-2 text-right">{item.subtotal.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Financial Terms */}
                                <div className="mb-8">
                                    <h3 className="text-sm font-bold uppercase mb-2">Payment Terms</h3>
                                    <div className="border-2 border-black p-4 bg-purple-50">
                                        <div className="grid grid-cols-3 gap-4 text-center divide-x divide-black">
                                            <div>
                                                <div className="text-xs uppercase font-bold text-gray-600">Total Contract Value</div>
                                                <div className="text-xl font-bold">{totalAmount.toLocaleString()}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs uppercase font-bold text-gray-600">Down Payment (Paid)</div>
                                                <div className="text-xl font-bold text-green-700">{downPayment.toLocaleString()}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs uppercase font-bold text-gray-600">Deferred Amount</div>
                                                <div className="text-xl font-bold text-red-700">{deferredAmount.toLocaleString()}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs italic text-gray-500 mt-2">
                                        * The deferred amount will be paid according to the agreed installment schedule saved in the system.
                                    </p>
                                </div>

                                {/* Agreement Text & Signature */}
                                <div className="border-t-2 border-black pt-4">
                                    <p className="text-xs text-justify mb-8 leading-relaxed">
                                        I, the undersigned, acknowledge receipt of the above goods in good condition and agree to pay the total amount according to the installment plan. Failure to pay on time may result in legal action or penalties as per company policy.
                                    </p>
                                    <div className="flex justify-between px-10">
                                        <div className="text-center">
                                            <div className="h-16 border-b border-black w-48"></div>
                                            <div className="text-xs font-bold uppercase mt-2">Seller Signature</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="h-16 border-b border-black w-48"></div>
                                            <div className="text-xs font-bold uppercase mt-2">Buyer Signature</div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td className="w-full pt-4">
                                <img src="/print/footer.png" alt="Footer" className="w-full h-auto object-contain max-h-[100px]" />
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            {/* Print Specific Styles - Correctly adds margin to the printed page */}
            <style jsx global>{`
                @media print {
                    @page { margin: 5mm; size: A4; }
                    body { -webkit-print-color-adjust: exact; }
                }
            `}</style>
        </div>
    );
}