"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getItemByBarcode, createItem, updateItem } from "@/lib/api/items";
import { Item } from "./config/types";
import DefineHeader from "./components/DefineHeader";
import BasicInfo from "./components/BasicInfo";
import PricingStock from "./components/PricingStock";
import BarcodeSection from "./components/BarcodeSection";
import DiscountSection from "./components/DiscountSection";
import { useSettings } from "@/lib/contexts/SettingsContext";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const getTodayDate = () => new Date().toISOString().split('T')[0];

const INITIAL_STATE: Item = {
    name: "",
    unit_type: "single",
    current_quantity: 0,
    alert_quantity: 0,
    expiration_date: getTodayDate(),
    cost_price: 0,
    single_price: 0,
    wholesale_price: 0,
    packet_cost_price: 0,
    packet_price: 0,
    packet_wholesale_price: 0,
    packet_quantity: 0,
    unit_per_packet: 0,
    barcodes: [],
    company_id: null,
    category_id: null,
    discount_type: undefined,
    discount_value: undefined,
    discount_start_date: undefined,
    discount_end_date: undefined,
};

export default function DefineItemPage() {
    const { t, settings } = useSettings();
    const isRtl = settings.appLanguage === 'ar' || settings.appLanguage === 'ku' || settings.appLanguage === 'ku_bd';

    // 2. GET URL PARAMS
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [searchBarcode, setSearchBarcode] = useState("");
    const [item, setItem] = useState<Item>(INITIAL_STATE);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [rightTab, setRightTab] = useState<"barcode" | "discounts">("barcode");

    // Refs
    const nameRef = useRef<HTMLInputElement>(null);
    const dateRef = useRef<HTMLInputElement>(null);
    const alertRef = useRef<HTMLInputElement>(null);
    const qtyRef = useRef<HTMLInputElement>(null);
    const costRef = useRef<HTMLInputElement>(null);
    const singleSellRef = useRef<HTMLInputElement>(null);
    const singleWholesaleRef = useRef<HTMLInputElement>(null);
    const packetUnitRef = useRef<HTMLInputElement>(null);
    const packetQtyRef = useRef<HTMLInputElement>(null);
    const packetCostRef = useRef<HTMLInputElement>(null);
    const packetSellRef = useRef<HTMLInputElement>(null);
    const unitRef = useRef<HTMLSelectElement>(null);

    const handleFocusSelect = (e: React.FocusEvent<HTMLInputElement>) => e.target.select();

    const handleEnterKey = (currentField: string) => {
        const isPacketType = ["single-packet", "single-packet-wholesale"].includes(item.unit_type);
        const isWholesale = ["single-wholesale", "single-packet-wholesale"].includes(item.unit_type);

        switch (currentField) {
            case "name": dateRef.current?.focus(); break;
            case "date": alertRef.current?.focus(); break;
            case "alert":
                if (isPacketType) packetUnitRef.current?.focus();
                else qtyRef.current?.focus();
                break;
            case "packetUnit": packetQtyRef.current?.focus(); break;
            case "packetQty": packetCostRef.current?.focus(); break;
            case "packetCost": packetSellRef.current?.focus(); break;
            case "packetSell": singleSellRef.current?.focus(); break;
            case "qty": costRef.current?.focus(); break;
            case "cost": singleSellRef.current?.focus(); break;
            case "singleSell":
                if (isWholesale) singleWholesaleRef.current?.focus();
                break;
            default: break;
        }
    };

    // 3. SEPARATE SEARCH LOGIC INTO REUSABLE FUNCTION
    const performSearch = async (barcodeToSearch: string) => {
        if (!barcodeToSearch) return;

        setLoading(true);
        setMsg("");

        try {
            const foundItem = await getItemByBarcode(barcodeToSearch);

            // Set input value to match what we are searching (important for auto-scan)
            setSearchBarcode(barcodeToSearch);

            if (foundItem) {
                const safeItem = {
                    ...foundItem,
                    expiration_date: foundItem.expiration_date ? foundItem.expiration_date.split('T')[0] : getTodayDate(),
                    discount_type: foundItem.discount_type ?? undefined,
                    discount_value: foundItem.discount_value ?? undefined,
                    discount_start_date: foundItem.discount_start_date ? String(foundItem.discount_start_date).split('T')[0] : undefined,
                    discount_end_date: foundItem.discount_end_date ? String(foundItem.discount_end_date).split('T')[0] : undefined,
                };
                setItem(safeItem);
                setIsUpdateMode(true);
                setMsg(t("define_item.item_found"));
                setTimeout(() => nameRef.current?.focus(), 100);
            } else {
                setItem({ ...INITIAL_STATE, barcodes: [barcodeToSearch] });
                setIsUpdateMode(false);
                setMsg(t("define_item.new_item"));
                setTimeout(() => nameRef.current?.focus(), 100);
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    // 4. USE EFFECT TO TRIGGER SCAN FROM URL
    useEffect(() => {
        const scanParam = searchParams.get("scan");
        if (scanParam) {
            performSearch(scanParam);
            const from = searchParams.get("from");
            const p = new URLSearchParams();
            if (from) p.set("from", from);
            ["page", "search", "sort", "losses"].forEach((key) => {
                const v = searchParams.get(key);
                if (v) p.set(key, v);
            });
            const replaceUrl = p.toString() ? `/define-item?${p.toString()}` : "/define-item";
            navigate(replaceUrl, { replace: true });
        }
    }, [searchParams, navigate]);

    // 5. UPDATE FORM HANDLER TO USE REUSABLE FUNCTION
    const handleScan = async (e: React.FormEvent) => {
        e.preventDefault();
        await performSearch(searchBarcode);
    };

    const handleSave = async () => {
        setLoading(true);
        setMsg("");

        try {
            let result;
            if (isUpdateMode && item.id) {
                result = await updateItem(item.id, item);
            } else {
                result = await createItem(item);
            }

            if (result) {
                setMsg(isUpdateMode ? t("define_item.update_success") : t("define_item.save_success"));
            } else {
                setErrorMessage("Failed to create item");
                setIsErrorOpen(true);
            }

        } catch (error) {
            console.error("Critical component error:", error);
            setErrorMessage(t("define_item.error_unexpected"));
            setIsErrorOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: keyof Item, value: any) => {
        setItem((prev) => ({ ...prev, [field]: value }));
    };

    const handleBarcodesChange = (newBarcodes: string[]) => {
        setItem((prev) => ({ ...prev, barcodes: newBarcodes }));
    };

    return (
        <div className="min-h-screen flex flex-col font-sans" dir={isRtl ? 'rtl' : 'ltr'}>

            <DefineHeader />

            <Dialog open={isErrorOpen} onOpenChange={setIsErrorOpen}>
                <DialogContent className="bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-red-600 font-bold">{t("define_item.error_title")}</DialogTitle>
                        <DialogDescription className="text-gray-700 font-medium pt-2">
                            {errorMessage}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={() => setIsErrorOpen(false)}
                            className="bg-gray-200 text-gray-800 px-4 py-2 rounded font-bold hover:bg-gray-300"
                        >
                            {t("define_item.close")}
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-2 p-3 mx-auto w-full">
                <BasicInfo
                    item={item}
                    handleChange={handleChange}
                    searchBarcode={searchBarcode}
                    setSearchBarcode={setSearchBarcode}
                    handleScan={handleScan}
                    msg={msg}
                    refs={{ nameRef, dateRef, alertRef, unitRef }}
                    onEnter={handleEnterKey}
                    onFocusSelect={handleFocusSelect}
                />

                <PricingStock
                    item={item}
                    handleChange={handleChange}
                    refs={{
                        qtyRef, costRef, singleSellRef, singleWholesaleRef,
                        packetUnitRef, packetQtyRef, packetCostRef, packetSellRef
                    }}
                    onEnter={handleEnterKey}
                    onFocusSelect={handleFocusSelect}
                />

                {/* Third column: Barcode or Discounts (tabs inside each section header) */}
                <div className="flex-1 min-h-0">
                    {rightTab === "barcode" && (
                        <BarcodeSection
                            barcodes={item.barcodes}
                            setBarcodes={handleBarcodesChange}
                            loading={loading}
                            onSave={handleSave}
                            isUpdateMode={isUpdateMode}
                            name={item.name}
                            activeTab={rightTab}
                            onTabChange={setRightTab}
                        />
                    )}
                    {rightTab === "discounts" && (
                        <DiscountSection
                            discountType={item.discount_type ?? ""}
                            discountValue={item.discount_value ?? 0}
                            discountStartDate={item.discount_start_date ?? ""}
                            discountEndDate={item.discount_end_date ?? ""}
                            onChange={(field, value) => handleChange(field, value)}
                            loading={loading}
                            onSave={handleSave}
                            isUpdateMode={isUpdateMode}
                            name={item.name}
                            activeTab={rightTab}
                            onTabChange={setRightTab}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}