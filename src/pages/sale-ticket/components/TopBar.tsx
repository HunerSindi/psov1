"use client";

import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { SaleResponse, addItemToSale, setSaleCustomer } from "@/lib/api/sale-ticket";
import { getCustomers, Customer } from "@/lib/api/customers";
import { getItemByBarcode } from "@/lib/api/items";
import { User, Search, X, Check, FileDown } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { downloadCashAsWord, type CashReceiptDocLabels } from "@/lib/sale-ticket-to-docx";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface TopBarRef {
    focusBarcode: () => void;
}

interface Props {
    saleData: SaleResponse | null;
    onRefresh: () => void;
}

const TopBar = forwardRef<TopBarRef, Props>(function TopBar({ saleData, onRefresh }, ref) {
    const { t, dir, settings } = useSettings();

    const barcodeInputRef = useRef<HTMLInputElement>(null);
    const errorSoundRef = useRef<HTMLAudioElement | null>(null);

    const [barcode, setBarcode] = useState("");
    const [selectedUnit, setSelectedUnit] = useState<"single" | "packet" | "wholesale">("single");
    const [showCustModal, setShowCustModal] = useState(false);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [custSearch, setCustSearch] = useState("");
    const [alertDialogOpen, setAlertDialogOpen] = useState(false);
    const [alertDialogMessage, setAlertDialogMessage] = useState("");

    const showAlert = (message: string) => {
        setAlertDialogMessage(message);
        setAlertDialogOpen(true);
        try {
            if (!errorSoundRef.current) {
                errorSoundRef.current = new Audio("/music/error.mp3");
            }
            errorSoundRef.current.currentTime = 0;
            errorSoundRef.current.play().catch(() => { });
        } catch (_) { }
    };

    const focusBarcodeInput = () => {
        setTimeout(() => {
            if (barcodeInputRef.current) {
                barcodeInputRef.current.focus();
            }
        }, 100);
    };

    useImperativeHandle(ref, () => ({ focusBarcode: focusBarcodeInput }), []);

    // Trigger focus whenever saleData changes (ticket switch, item added, etc.)
    // or when the customer modal closes.
    useEffect(() => {
        if (!showCustModal) {
            focusBarcodeInput();
        }
    }, [saleData, showCustModal]);
    // ---------------------------

    const getUnitLabel = (unit: string) => {
        if (unit === "packet") return t("sale_ticket.topbar.unit_packet");
        if (unit === "wholesale") return t("sale_ticket.topbar.unit_wholesale");
        return t("sale_ticket.topbar.unit_single");
    };

    const handleScan = async (e: React.FormEvent) => {
        e.preventDefault();

        // Keep focus on input immediately after pressing enter
        focusBarcodeInput();

        if (!saleData || !barcode) return;

        try {
            const item = await getItemByBarcode(barcode);

            if (!item) {
                showAlert(t("sale_ticket.topbar.alert_item_not_found"));
                setBarcode("");
                return;
            }

            const allowedType = item.unit_type || "single";

            if (selectedUnit === "wholesale" && !allowedType.includes("wholesale")) {
                showAlert(`Error: Item is "${allowedType}". Cannot sell as Wholesale.`);
                setBarcode("");
                return;
            }

            if (selectedUnit === "packet" && !allowedType.includes("packet")) {
                showAlert(`Error: Item is "${allowedType}". Cannot sell as Packet.`);
                setBarcode("");
                return;
            }

            let typeToSend = "single";
            if (selectedUnit === "packet") {
                typeToSend = "packet";
            } else if (selectedUnit === "wholesale") {
                typeToSend = "wholesale";
            } else {
                if (["kg", "m", "cm", "liter"].includes(item.unit_type)) {
                    typeToSend = item.unit_type;
                } else {
                    typeToSend = "single";
                }
            }

            const success = await addItemToSale(saleData.receipt.id, barcode, typeToSend, 1);

            if (success) {
                setBarcode("");
                onRefresh(); // This will trigger the useEffect above to refocus
            } else {
                showAlert(t("sale_ticket.topbar.alert_stock_error"));
            }

        } catch (error) {
            console.error("Scan Error:", error);
            showAlert(t("sale_ticket.topbar.alert_scan_error"));
        }
    };

    const fetchCustomers = async (query = "") => {
        try {
            const res = await getCustomers(query, 1, 50);
            if (res && res.data) {
                setCustomers(res.data);
            } else {
                setCustomers([]);
            }
        } catch (error) {
            console.error("Failed to load customers", error);
            setCustomers([]);
        }
    };

    useEffect(() => {
        if (showCustModal) {
            const timer = setTimeout(() => {
                fetchCustomers(custSearch);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [showCustModal, custSearch]);

    const handleCustomerSelect = async (custId: number) => {
        if (!saleData) return;
        await setSaleCustomer(saleData.receipt.id, custId);
        setShowCustModal(false); // This triggers the useEffect to refocus input
        onRefresh();
    };

    return (
        <div className="flex flex-col md:flex-row gap-2 items-start md:items-center justify-between">

            <form onSubmit={handleScan} className="flex flex-1 w-full gap-2 items-end">
                <div className="flex bg-gray-200   border-gray-400 gap-2 shrink-0">
                    <button
                        type="button"
                        onClick={() => { setSelectedUnit("single"); focusBarcodeInput(); }}
                        className={`px-6 p-[5px] text-[16px] font-bold uppercase border transition-colors ${selectedUnit === "single"
                            ? "bg-black text-white border-black"
                            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                            }`}
                    >
                        {t("sale_ticket.topbar.unit_single")}
                    </button>
                    <button
                        type="button"
                        onClick={() => { setSelectedUnit("packet"); focusBarcodeInput(); }}
                        className={`px-6 p-[5px] text-[16px] font-bold uppercase border transition-colors ${selectedUnit === "packet"
                            ? "bg-black text-white border-black"
                            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                            }`}
                    >
                        {t("sale_ticket.topbar.unit_packet")}
                    </button>
                    <button
                        type="button"
                        onClick={() => { setSelectedUnit("wholesale"); focusBarcodeInput(); }}
                        className={`px-6 p-[5px] text-[16px] font-bold uppercase border transition-colors ${selectedUnit === "wholesale"
                            ? "bg-black text-white border-black"
                            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                            }`}
                    >
                        {t("sale_ticket.topbar.unit_wholesale")}
                    </button>
                </div>

                <div className="flex-1 flex gap-0">
                    <input
                        ref={barcodeInputRef} // <--- 3. Attach Ref here
                        autoFocus
                        type="text"
                        placeholder={`${t("sale_ticket.topbar.scan_placeholder")} ${getUnitLabel(selectedUnit)}...`}
                        value={barcode}
                        onChange={e => setBarcode(e.target.value)}
                        // Optional: Ensure focus stays if clicked out, or simply rely on the useEffects
                        onBlur={() => {
                            // If you want AGGRESSIVE focus (always forces back unless modal is open):
                            // if (!showCustModal) setTimeout(focusBarcodeInput, 200); 
                        }}
                        className="flex-1 h-9 border border-gray-400 px-3 text-lg font-mono outline-none focus:border-blue-600 focus:bg-blue-50 rounded-none placeholder:text-sm"
                    />
                    <button
                        type="submit"
                        className="bg-blue-700 text-white px-5 h-9 font-bold text-sm uppercase hover:bg-blue-800 border border-blue-900 rounded-none"
                    >
                        {t("sale_ticket.topbar.add_btn")}
                    </button>
                </div>
            </form>

            <div className="flex items-center gap-2 w-full md:w-auto bg-gray-100 border border-gray-300 p-1 px-2">
                <div className="text-right leading-tight min-w-[100px]">
                    {saleData?.customer ? (
                        <>
                            <div className="font-bold text-xs text-gray-800 uppercase">{saleData.customer.name}</div>
                            <div className={`text-[10px] font-mono font-bold ${(saleData.customer.balance || 0) > 0 ? "text-red-600" : "text-green-600"
                                }`}>
                                {t("sale_ticket.topbar.balance")} {(saleData.customer.balance || 0).toLocaleString()}
                            </div>
                        </>
                    ) : (
                        <div className="text-xs text-gray-400 italic font-bold">
                            {t("sale_ticket.topbar.guest_customer")}
                        </div>
                    )}
                </div>
                <button
                    onClick={() => { setCustSearch(""); setShowCustModal(true); }}
                    className="h-8 w-8 bg-white border border-gray-400 flex items-center justify-center text-gray-600 hover:text-black hover:border-black transition-colors"
                    title={t("sale_ticket.topbar.select_customer")}
                >
                    <User size={18} />
                </button>
                <button
                    type="button"
                    title={t("sale_ticket.totals.btn_download_word")}
                    disabled={!saleData?.items?.length}
                    onClick={async () => {
                        if (!saleData?.items?.length) return;
                        const labels: CashReceiptDocLabels = {
                            title: t("sale_ticket.header.title"),
                            label_date: t("sale_ticket.totals.label_date"),
                            label_customer: t("sale_ticket.totals.label_customer"),
                            label_ticket_id: t("sale_ticket.totals.label_ticket_id"),
                            label_subtotal: t("sale_ticket.totals.label_subtotal"),
                            discount: t("sale_ticket.totals.discount"),
                            total_payable: t("sale_ticket.totals.total_payable"),
                            header_hash: t("sale_ticket.table.headers.hash"),
                            header_desc: t("sale_ticket.table.headers.desc"),
                            header_unit: t("sale_ticket.table.headers.unit"),
                            header_price: t("sale_ticket.table.headers.price"),
                            header_qty: t("sale_ticket.table.headers.qty"),
                            header_discount: t("sale_ticket.totals.discount"),
                            header_total: t("sale_ticket.table.headers.total"),
                            guest_customer: t("sale_ticket.topbar.guest_customer"),
                            getUnitLabel: (type: string) => {
                                if (type.includes("packet")) return t("sale_ticket.topbar.unit_packet");
                                if (type.includes("wholesale")) return t("sale_ticket.topbar.unit_wholesale");
                                return t("sale_ticket.topbar.unit_single");
                            },
                        };
                        type ImgData = { data: ArrayBuffer; type: "png" | "jpg" | "gif" | "bmp" };
                        const dataUrlToImageData = (dataUrl: string): ImgData | undefined => {
                            try {
                                const match = dataUrl.match(/^data:image\/(\w+);base64,(.+)$/);
                                if (!match) return undefined;
                                const mime = match[1].toLowerCase();
                                const type = mime === "jpeg" ? "jpg" : mime === "png" || mime === "gif" || mime === "bmp" ? mime : "png";
                                const binary = atob(match[2]);
                                const bytes = new Uint8Array(binary.length);
                                for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
                                return { data: bytes.buffer, type };
                            } catch {
                                return undefined;
                            }
                        };
                        const fetchImageData = async (url: string): Promise<ImgData | undefined> => {
                            try {
                                const res = await fetch(url);
                                if (!res.ok) return undefined;
                                const data = await res.arrayBuffer();
                                const path = url.split("?")[0].toLowerCase();
                                const type = path.endsWith(".jpg") || path.endsWith(".jpeg") ? "jpg" : path.endsWith(".gif") ? "gif" : path.endsWith(".bmp") ? "bmp" : "png";
                                return { data, type };
                            } catch {
                                return undefined;
                            }
                        };

                        let headerImageData: ImgData | undefined;
                        let footerImageData: ImgData | undefined;
                        if (settings?.headerA4) {
                            if (settings.headerA4.startsWith("data:")) {
                                headerImageData = dataUrlToImageData(settings.headerA4);
                            } else {
                                const url = settings.headerA4.startsWith("http") ? settings.headerA4 : `${typeof window !== "undefined" ? window.location.origin : ""}${settings.headerA4}`;
                                headerImageData = await fetchImageData(url);
                            }
                        }
                        if (settings?.footerA4) {
                            if (settings.footerA4.startsWith("data:")) {
                                footerImageData = dataUrlToImageData(settings.footerA4);
                            } else {
                                const url = settings.footerA4.startsWith("http") ? settings.footerA4 : `${typeof window !== "undefined" ? window.location.origin : ""}${settings.footerA4}`;
                                footerImageData = await fetchImageData(url);
                            }
                        }
                        await downloadCashAsWord(saleData, labels, {
                            rtl: dir === "rtl",
                            headerImageData,
                            footerImageData,
                        });
                    }}
                    className="h-8 px-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none text-white border border-blue-800 flex items-center justify-center gap-1 text-xs font-bold uppercase transition-colors"
                >
                    <FileDown size={14} />
                    <span className="hidden sm:inline">{t("sale_ticket.totals.btn_download_word")}</span>
                </button>
            </div>

            {/* CUSTOMER MODAL (Unchanged logic) */}
            {showCustModal && (
                <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white border-2 border-gray-600 w-full max-w-md flex flex-col shadow-xl h-[500px]">
                        <div className="bg-gray-200 border-b border-gray-400 p-3 flex justify-between items-center shrink-0">
                            <h3 className="font-bold text-sm uppercase text-gray-800">
                                {t("sale_ticket.topbar.select_customer")}
                            </h3>
                            <button onClick={() => setShowCustModal(false)} className="text-gray-500 hover:text-red-600">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-2 border-b border-gray-300 bg-gray-50 shrink-0">
                            <div className="flex items-center bg-white border border-gray-400 px-2 h-9">
                                <Search size={16} className="text-gray-400 mr-2" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder={t("sale_ticket.topbar.search_placeholder")}
                                    value={custSearch}
                                    onChange={e => setCustSearch(e.target.value)}
                                    className="flex-1 outline-none text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 bg-white">
                            {customers.length === 0 ? (
                                <div className="text-center p-4 text-gray-400 text-sm italic">
                                    {t("sale_ticket.topbar.no_customers")}
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {customers.map(c => (
                                        <button
                                            key={c.id}
                                            onClick={() => handleCustomerSelect(c.id!)}
                                            className={`w-full text-left p-2 border border-gray-200 hover:bg-blue-50 hover:border-blue-300 flex justify-between items-center group ${saleData?.customer?.id === c.id ? "bg-blue-50 border-blue-500" : ""
                                                }`}
                                        >
                                            <div>
                                                <div className="font-bold text-sm text-gray-800">{c.name}</div>
                                                <div className="text-xs text-gray-500">{c.phone}</div>
                                            </div>
                                            {saleData?.customer?.id === c.id && <Check size={16} className="text-blue-600" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="p-2 bg-gray-100 border-t border-gray-300 text-right shrink-0">
                            <button
                                onClick={() => setShowCustModal(false)}
                                className="bg-white border border-gray-400 px-4 py-1 text-xs font-bold uppercase hover:bg-gray-200"
                            >
                                {t("sale_ticket.topbar.close")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Dialog open={alertDialogOpen} onOpenChange={(open) => {
                setAlertDialogOpen(open);
                if (!open) focusBarcodeInput();
            }}>
                <DialogContent className="bg-white border-red-100 rounded-sm max-w-sm" aria-describedby="alert-dialog-description" showCloseButton={false}>
                    <DialogHeader>
                        <DialogTitle className="text-sm font-bold uppercase text-red-700">
                            {t("sale_ticket.topbar.alert_title" as any)}
                        </DialogTitle>
                    </DialogHeader>
                    <DialogDescription id="alert-dialog-description" className="text-red-800 text-sm">
                        {alertDialogMessage}
                    </DialogDescription>
                    <DialogFooter className="gap-2">
                        <Button
                            size="sm"
                            onClick={() => {
                                setAlertDialogOpen(false);
                                focusBarcodeInput();
                            }}
                            className="rounded-none bg-red-600 hover:bg-red-700 text-white border-red-700"
                        >
                            {t("sale_ticket.topbar.close")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
});

export default TopBar;