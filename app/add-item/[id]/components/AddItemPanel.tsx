// "use client";

// import React, { useState, useRef } from "react";
// import { getItemByBarcode, Item } from "@/lib/api/items";
// import { addItemToReceipt } from "@/lib/api/receipts";
// import { useSettings } from "@/lib/contexts/SettingsContext";

// interface Props {
//     receiptId: number;
//     onSuccess: () => void;
// }

// export default function AddItemPanel({ receiptId, onSuccess }: Props) {
//     const { t } = useSettings();

//     // --- STATE ---
//     const [barcode, setBarcode] = useState("");
//     const [scannedItem, setScannedItem] = useState<Item | null>(null);
//     const [error, setError] = useState("");

//     // Single Fields
//     const [qty, setQty] = useState<number | "">("");
//     const [cost, setCost] = useState<number | "">("");
//     const [price, setPrice] = useState<number | "">("");
//     const [wholesalePrice, setWholesalePrice] = useState<number | "">("");
//     const [expiry, setExpiry] = useState("");

//     // Packet Fields
//     const [pktQty, setPktQty] = useState<number | "">("");
//     const [pktCost, setPktCost] = useState<number | "">("");
//     const [pktPrice, setPktPrice] = useState<number | "">("");
//     const [pktWholesalePrice, setPktWholesalePrice] = useState<number | "">("");

//     // --- REFS ---
//     const barcodeRef = useRef<HTMLInputElement>(null);

//     // Packet Refs
//     const pktQtyRef = useRef<HTMLInputElement>(null);
//     const pktCostRef = useRef<HTMLInputElement>(null);
//     const pktPriceRef = useRef<HTMLInputElement>(null);
//     const pktWholesaleRef = useRef<HTMLInputElement>(null);

//     // Single Refs
//     const qtyRef = useRef<HTMLInputElement>(null);
//     const costRef = useRef<HTMLInputElement>(null);
//     const priceRef = useRef<HTMLInputElement>(null);
//     const wholesaleRef = useRef<HTMLInputElement>(null);

//     const expiryRef = useRef<HTMLInputElement>(null);
//     const addBtnRef = useRef<HTMLButtonElement>(null);

//     // --- HANDLERS ---
//     const handleScan = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setError("");
//         if (!barcode) return;

//         const item = await getItemByBarcode(barcode);
//         if (!item) {
//             setError(t("add_item.item_not_found"));
//             setScannedItem(null);
//             return;
//         }

//         setScannedItem(item);

//         // Defaults
//         setQty(1);
//         setCost(item.cost_price);
//         setPrice(item.single_price);
//         setWholesalePrice(item.wholesale_price || 0);
//         setExpiry(item.expiration_date || new Date().toISOString().split('T')[0]);

//         // Packet Defaults
//         setPktQty(0);
//         setPktCost(item.packet_cost_price || 0);
//         setPktPrice(item.packet_price || 0);
//         setPktWholesalePrice(item.packet_wholesale_price || 0);

//         // Focus Logic
//         setTimeout(() => {
//             qtyRef.current?.focus();
//             qtyRef.current?.select();
//         }, 100);
//     };

//     const handlePktQtyChange = (val: number) => {
//         setPktQty(val);
//         if (scannedItem && scannedItem.unit_per_packet > 0) {
//             setQty(val * scannedItem.unit_per_packet);
//         }
//     };

//     const handlePktCostChange = (val: number) => {
//         setPktCost(val);
//         if (scannedItem && scannedItem.unit_per_packet > 0) {
//             const single = val / scannedItem.unit_per_packet;
//             setCost(parseFloat(single.toFixed(2)));
//         }
//     };

//     const handleAddItem = async () => {
//         if (!scannedItem) return;

//         const payload: any = {
//             item_id: scannedItem.id,
//             expiration_date: expiry,
//             quantity: Number(qty),
//             cost_price: Number(cost),
//             single_price: Number(price),
//             wholesale_price: Number(wholesalePrice),
//             packet_quantity: 0,
//             packet_cost_price: 0,
//             packet_price: 0,
//             packet_wholesale_price: 0
//         };

//         const isPacketType = ["single-packet", "single-packet-wholesale"].includes(scannedItem.unit_type);

//         if (isPacketType) {
//             payload.packet_quantity = Number(pktQty);
//             payload.packet_cost_price = Number(pktCost);
//             payload.packet_price = Number(pktPrice);
//             payload.packet_wholesale_price = Number(pktWholesalePrice);
//         }

//         const success = await addItemToReceipt(receiptId, payload);

//         if (success) {
//             onSuccess();
//             setBarcode("");
//             setScannedItem(null);
//             setQty("");
//             barcodeRef.current?.focus();
//         } else {
//             alert("Failed to add item");
//         }
//     };

//     const showPacketFields = scannedItem && ["single-packet", "single-packet-wholesale"].includes(scannedItem.unit_type);
//     const showSingleWholesale = scannedItem && ["single-wholesale", "single-packet-wholesale"].includes(scannedItem.unit_type);
//     const showPacketWholesale = scannedItem && ["single-packet-wholesale"].includes(scannedItem.unit_type);

//     const handleEnter = (e: React.KeyboardEvent, field: string) => {
//         if (e.key !== "Enter") return;
//         e.preventDefault();

//         switch (field) {
//             case "qty":
//                 if (showPacketFields) pktQtyRef.current?.focus();
//                 else costRef.current?.focus();
//                 break;
//             case "pktQty": pktCostRef.current?.focus(); break;
//             case "pktCost": pktPriceRef.current?.focus(); break;
//             case "pktPrice":
//                 if (showPacketWholesale) pktWholesaleRef.current?.focus();
//                 else costRef.current?.focus();
//                 break;
//             case "pktWholesale": costRef.current?.focus(); break;
//             case "cost": priceRef.current?.focus(); break;
//             case "price":
//                 if (showSingleWholesale) wholesaleRef.current?.focus();
//                 else expiryRef.current?.focus();
//                 break;
//             case "wholesale": expiryRef.current?.focus(); break;
//             case "expiry": addBtnRef.current?.focus(); handleAddItem(); break;
//         }
//     };

//     return (
//         <div className="bg-white p-4 shadow-md sticky top-[73px] z-20 border-b-4 border-blue-600">
//             <div className="flex flex-col gap-2">
//                 {/* Row 1: Scanner */}
//                 <div className="flex gap-4">
//                     <div className="w-1/4">
//                         <label className="text-[10px] font-bold text-gray-400 uppercase">{t("add_item.barcode_label")}</label>
//                         <form onSubmit={handleScan}>
//                             <input
//                                 ref={barcodeRef}
//                                 autoFocus
//                                 type="text"
//                                 placeholder={t("add_item.scan_placeholder")}
//                                 className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
//                                 value={barcode}
//                                 onChange={e => setBarcode(e.target.value)}
//                                 onFocus={e => e.target.select()}
//                             />
//                         </form>
//                     </div>
//                     <div className="flex-1">
//                         <label className="text-[10px] font-bold text-gray-400 uppercase">{t("add_item.item_name_label")}</label>
//                         <div className={`w-full p-2 border rounded bg-gray-50 text-sm font-bold h-[38px] flex items-center ${error ? "text-red-500 border-red-200" : "text-gray-800 border-gray-200"}`}>
//                             {error || scannedItem?.name || t("add_item.ready_to_scan")}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Row 2: Inputs */}
//                 {scannedItem && (
//                     <div className="grid grid-cols-12 gap-2 animate-in slide-in-from-top-2 fade-in items-end">

//                         {/* --- SINGLE QUANTITY --- */}
//                         <div className="col-span-1">
//                             <label className="text-[10px] font-bold text-gray-500 uppercase">{t("add_item.qty_label")}</label>
//                             <input
//                                 ref={qtyRef}
//                                 type="number"
//                                 className="w-full border border-blue-300 p-2 rounded font-bold text-center focus:ring-2 focus:ring-blue-500 outline-none bg-blue-50"
//                                 value={qty}
//                                 onChange={e => setQty(Number(e.target.value))}
//                                 onKeyDown={e => handleEnter(e, "qty")}
//                                 onFocus={e => e.target.select()}
//                             />
//                         </div>

//                         {/* --- PACKET SECTION --- */}
//                         {showPacketFields && (
//                             <>
//                                 <div className="col-span-1">
//                                     <label className="text-[10px] font-bold text-purple-600 uppercase">{t("add_item.pkt_qty_label")}</label>
//                                     <input
//                                         ref={pktQtyRef}
//                                         type="number"
//                                         className="w-full border border-purple-200 p-2 rounded text-center focus:ring-2 focus:ring-purple-500 outline-none"
//                                         value={pktQty}
//                                         onChange={e => handlePktQtyChange(Number(e.target.value))}
//                                         onKeyDown={e => handleEnter(e, "pktQty")}
//                                         onFocus={e => e.target.select()}
//                                     />
//                                 </div>
//                                 <div className="col-span-1">
//                                     <label className="text-[10px] font-bold text-purple-600 uppercase">{t("add_item.pkt_cost_label")}</label>
//                                     <input
//                                         ref={pktCostRef}
//                                         type="number"
//                                         className="w-full border border-purple-200 p-2 rounded text-center focus:ring-2 focus:ring-purple-500 outline-none"
//                                         value={pktCost}
//                                         onChange={e => handlePktCostChange(Number(e.target.value))}
//                                         onKeyDown={e => handleEnter(e, "pktCost")}
//                                         onFocus={e => e.target.select()}
//                                     />
//                                 </div>
//                                 <div className="col-span-1">
//                                     <label className="text-[10px] font-bold text-purple-600 uppercase">{t("add_item.pkt_price_label")}</label>
//                                     <input
//                                         ref={pktPriceRef}
//                                         type="number"
//                                         className="w-full border border-purple-200 p-2 rounded text-center focus:ring-2 focus:ring-purple-500 outline-none"
//                                         value={pktPrice}
//                                         onChange={e => setPktPrice(Number(e.target.value))}
//                                         onKeyDown={e => handleEnter(e, "pktPrice")}
//                                         onFocus={e => e.target.select()}
//                                     />
//                                 </div>
//                                 {showPacketWholesale && (
//                                     <div className="col-span-1">
//                                         <label className="text-[10px] font-bold text-orange-600 uppercase">{t("add_item.pkt_whl_label")}</label>
//                                         <input
//                                             ref={pktWholesaleRef}
//                                             type="number"
//                                             className="w-full border border-orange-200 p-2 rounded text-center focus:ring-2 focus:ring-orange-500 outline-none"
//                                             value={pktWholesalePrice}
//                                             onChange={e => setPktWholesalePrice(Number(e.target.value))}
//                                             onKeyDown={e => handleEnter(e, "pktWholesale")}
//                                             onFocus={e => e.target.select()}
//                                         />
//                                     </div>
//                                 )}
//                             </>
//                         )}

//                         {/* --- SINGLE PRICES SECTION --- */}
//                         <div className="col-span-1">
//                             <label className="text-[10px] font-bold text-gray-500 uppercase">{t("add_item.cost_label")}</label>
//                             <input
//                                 ref={costRef}
//                                 type="number"
//                                 className="w-full border p-2 rounded text-center focus:ring-2 focus:ring-blue-500 outline-none"
//                                 value={cost}
//                                 onChange={e => setCost(Number(e.target.value))}
//                                 onKeyDown={e => handleEnter(e, "cost")}
//                                 onFocus={e => e.target.select()}
//                             />
//                         </div>

//                         <div className="col-span-1">
//                             <label className="text-[10px] font-bold text-gray-500 uppercase">{t("add_item.price_label")}</label>
//                             <input
//                                 ref={priceRef}
//                                 type="number"
//                                 className="w-full border p-2 rounded text-center focus:ring-2 focus:ring-blue-500 outline-none"
//                                 value={price}
//                                 onChange={e => setPrice(Number(e.target.value))}
//                                 onKeyDown={e => handleEnter(e, "price")}
//                                 onFocus={e => e.target.select()}
//                             />
//                         </div>

//                         {showSingleWholesale && (
//                             <div className="col-span-1">
//                                 <label className="text-[10px] font-bold text-orange-600 uppercase">{t("add_item.whl_label")}</label>
//                                 <input
//                                     ref={wholesaleRef}
//                                     type="number"
//                                     className="w-full border border-orange-200 p-2 rounded text-center focus:ring-2 focus:ring-orange-500 outline-none"
//                                     value={wholesalePrice}
//                                     onChange={e => setWholesalePrice(Number(e.target.value))}
//                                     onKeyDown={e => handleEnter(e, "wholesale")}
//                                     onFocus={e => e.target.select()}
//                                 />
//                             </div>
//                         )}

//                         {/* EXPIRY */}
//                         <div className="col-span-2">
//                             <label className="text-[10px] font-bold text-gray-500 uppercase">{t("add_item.expires_label")}</label>
//                             <input
//                                 ref={expiryRef}
//                                 type="date"
//                                 className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//                                 value={expiry}
//                                 onChange={e => setExpiry(e.target.value)}
//                                 onKeyDown={e => handleEnter(e, "expiry")}
//                             />
//                         </div>

//                         {/* ADD BUTTON */}
//                         <div className="col-span-2">
//                             <button
//                                 ref={addBtnRef}
//                                 onClick={handleAddItem}
//                                 className="w-full bg-green-600 text-white h-[38px] rounded font-bold shadow hover:bg-green-700 active:scale-95 transition-all text-sm"
//                             >
//                                 {t("add_item.add_btn")}
//                             </button>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }