"use client";

import React, { useState, useRef } from "react";
import { getItemByBarcode, Item } from "@/lib/api/items";
import { addItemToReceipt } from "@/lib/api/receipts";
import { useSettings } from "@/lib/contexts/SettingsContext";

// Child Components
import ScannerHeader from "./ScannerHeader";
import SingleFields from "./SingleFields";
import PacketFields from "./PacketFields";
import ActionFields from "./ActionFields";

interface Props {
    receiptId: number;
    onSuccess: () => void;
}

export default function AddItemPanel({ receiptId, onSuccess }: Props) {
    const { t } = useSettings();

    // --- STATE ---
    const [barcode, setBarcode] = useState("");
    const [scannedItem, setScannedItem] = useState<Item | null>(null);
    const [error, setError] = useState("");

    // Single Fields
    const [qty, setQty] = useState<number | "">("");
    const [cost, setCost] = useState<number | "">("");
    const [price, setPrice] = useState<number | "">("");
    const [wholesalePrice, setWholesalePrice] = useState<number | "">("");
    const [expiry, setExpiry] = useState("");

    // Packet Fields
    const [unitPerPacket, setUnitPerPacket] = useState<number | "">("");
    const [pktQty, setPktQty] = useState<number | "">("");
    const [pktCost, setPktCost] = useState<number | "">("");
    const [pktPrice, setPktPrice] = useState<number | "">("");
    const [pktWholesalePrice, setPktWholesalePrice] = useState<number | "">("");

    // --- REFS ---
    const barcodeRef = useRef<HTMLInputElement>(null);
    // Packet Refs
    const pktUnitRef = useRef<HTMLInputElement>(null);
    const pktQtyRef = useRef<HTMLInputElement>(null);
    const pktCostRef = useRef<HTMLInputElement>(null);
    const pktPriceRef = useRef<HTMLInputElement>(null);
    const pktWholesaleRef = useRef<HTMLInputElement>(null);
    // Single Refs
    const qtyRef = useRef<HTMLInputElement>(null);
    const costRef = useRef<HTMLInputElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);
    const wholesaleRef = useRef<HTMLInputElement>(null);
    // Action Refs
    const expiryRef = useRef<HTMLInputElement>(null);
    const addBtnRef = useRef<HTMLButtonElement>(null);

    // --- HELPERS FOR LOGIC ---
    const isPacketType = scannedItem && ["single-packet", "single-packet-wholesale"].includes(scannedItem.unit_type);

    // --- HANDLERS ---
    const handleScan = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!barcode) return;

        const item = await getItemByBarcode(barcode);
        if (!item) {
            setError(t("add_item.item_not_found"));
            setScannedItem(null);
            return;
        }

        setScannedItem(item);

        // Single Defaults
        setQty(1);
        setCost(item.cost_price);
        setPrice(item.single_price);
        setWholesalePrice(item.wholesale_price || 0);
        setExpiry(item.expiration_date || new Date().toISOString().split('T')[0]);

        // Packet Defaults
        const unit = item.unit_per_packet || 1;
        setUnitPerPacket(unit);
        setPktQty(0);
        setPktCost(item.packet_cost_price || 0);
        setPktPrice(item.packet_price || 0);
        setPktWholesalePrice(item.packet_wholesale_price || 0);

        // Check if Packet Type
        const isPacket = ["single-packet", "single-packet-wholesale"].includes(item.unit_type);

        // Focus Logic: If Packet, focus Unit per Packet; else focus Single Qty
        setTimeout(() => {
            if (isPacket) {
                pktUnitRef.current?.focus();
                pktUnitRef.current?.select();
            } else {
                qtyRef.current?.focus();
                qtyRef.current?.select();
            }
        }, 100);
    };

    // ------------------------------------------------
    // CALCULATION LOGIC
    // ------------------------------------------------

    // 1. Change Unit Per Packet
    const handleUnitChange = (newUnit: number) => {
        setUnitPerPacket(newUnit);
        // Recalculate Single Qty if Packet Qty exists
        if (Number(pktQty) > 0) {
            setQty(Number(pktQty) * newUnit);
        }
        // Recalculate Packet Cost if Single Cost exists
        if (Number(cost) > 0) {
            setPktCost(Number(cost) * newUnit);
        }
    };

    // 2. Change Packet Qty (Updates Single Qty)
    const handlePktQtyChange = (val: number) => {
        setPktQty(val);
        const unit = Number(unitPerPacket) || 1;
        setQty(val * unit);
    };

    // 3. Change Single Qty (Updates Packet Qty)
    const handleSingleQtyChange = (val: number) => {
        setQty(val);
        const unit = Number(unitPerPacket) || 1;
        if (isPacketType && unit > 0) {
            setPktQty(parseFloat((val / unit).toFixed(2)));
        }
    };

    // 4. Change Packet Cost (Updates Single Cost)
    const handlePktCostChange = (val: number) => {
        setPktCost(val);
        const unit = Number(unitPerPacket) || 1;
        if (unit > 0) {
            setCost(parseFloat((val / unit).toFixed(2)));
        }
    };

    // 5. Change Single Cost (Updates Packet Cost)
    const handleSingleCostChange = (val: number) => {
        setCost(val);
        const unit = Number(unitPerPacket) || 1;
        if (isPacketType) {
            setPktCost(parseFloat((val * unit).toFixed(2)));
        }
    };

    // ------------------------------------------------

    const handleAddItem = async () => {
        if (!scannedItem) return;

        // 1. Prepare base payload
        const payload: any = {
            item_id: scannedItem.id,
            expiration_date: expiry,
            quantity: Number(qty),
            cost_price: Number(cost),
            single_price: Number(price),
            wholesale_price: Number(wholesalePrice),
            // Default Packet Values
            packet_quantity: 0,
            packet_cost_price: 0,
            packet_price: 0,
            packet_wholesale_price: 0,
            unit_per_packet: 1
        };

        // 2. Add Packet Data if applicable
        if (isPacketType) {
            payload.packet_quantity = Number(pktQty);
            payload.packet_cost_price = Number(pktCost);
            payload.packet_price = Number(pktPrice);
            payload.packet_wholesale_price = Number(pktWholesalePrice);

            payload.unit_per_packet = Number(unitPerPacket);
        }

        const success = await addItemToReceipt(receiptId, payload);

        if (success) {
            onSuccess();
            setBarcode("");
            setScannedItem(null);
            setQty("");
            barcodeRef.current?.focus();
        } else {
            alert("Failed to add item");
        }
    };

    const showPacketFields = scannedItem && ["single-packet", "single-packet-wholesale"].includes(scannedItem.unit_type);
    const showSingleWholesale = scannedItem && ["single-wholesale", "single-packet-wholesale"].includes(scannedItem.unit_type);
    const showPacketWholesale = scannedItem && ["single-packet-wholesale"].includes(scannedItem.unit_type);

    // --- FOCUS NAVIGATION ---
    const handleEnter = (e: React.KeyboardEvent, field: string) => {
        if (e.key !== "Enter") return;
        e.preventDefault();

        switch (field) {
            // Packet Flow
            case "pktUnit": pktQtyRef.current?.focus(); break;
            case "pktQty": pktCostRef.current?.focus(); break;
            case "pktCost": pktPriceRef.current?.focus(); break;
            case "pktPrice":
                if (showPacketWholesale) pktWholesaleRef.current?.focus();
                else costRef.current?.focus();
                break;
            case "pktWholesale": costRef.current?.focus(); break;

            // Single Flow
            case "qty":
                if (showPacketFields) pktUnitRef.current?.focus(); // Start packet flow if available
                else costRef.current?.focus();
                break;
            case "cost": priceRef.current?.focus(); break;
            case "price":
                if (showSingleWholesale) wholesaleRef.current?.focus();
                else expiryRef.current?.focus();
                break;
            case "wholesale": expiryRef.current?.focus(); break;

            // Action Flow
            case "expiry": addBtnRef.current?.focus(); handleAddItem(); break;
        }
    };

    return (
        <div className="bg-white p-4 shadow-md sticky top-[73px] z-20 border-b-4 border-blue-600">
            <div className="flex flex-col gap-2">
                {/* 1. Scanner */}
                <ScannerHeader
                    barcode={barcode}
                    setBarcode={setBarcode}
                    handleScan={handleScan}
                    barcodeRef={barcodeRef}
                    error={error}
                    scannedItem={scannedItem}
                    onCalculate={(newCost, newQty) => {
                        if (newCost > 0) handleSingleCostChange(newCost);
                        if (newQty > 0) handleSingleQtyChange(newQty);
                    }}
                />

                {/* 2. Grid Inputs */}
                {scannedItem && (
                    <div className="grid grid-cols-12 gap-2 animate-in slide-in-from-top-2 fade-in items-end">

                        {/* B. Packet Fields (Show First in Grid if Packet Type) */}
                        {showPacketFields && (
                            <PacketFields
                                unitPerPacket={unitPerPacket} onUnitChange={handleUnitChange}
                                pktQty={pktQty} onQtyChange={handlePktQtyChange}
                                pktCost={pktCost} onCostChange={handlePktCostChange}
                                pktPrice={pktPrice} onPriceChange={setPktPrice}
                                pktWholesalePrice={pktWholesalePrice} onWholesaleChange={setPktWholesalePrice}
                                refs={{
                                    unit: pktUnitRef,
                                    qty: pktQtyRef,
                                    cost: pktCostRef,
                                    price: pktPriceRef,
                                    wholesale: pktWholesaleRef
                                }}
                                handleEnter={handleEnter}
                                showWholesale={showPacketWholesale}
                            />
                        )}

                        {/* A. Single Fields */}
                        <SingleFields
                            qty={qty} setQty={handleSingleQtyChange}
                            cost={cost} setCost={handleSingleCostChange}
                            price={price} setPrice={setPrice}
                            wholesalePrice={wholesalePrice} setWholesalePrice={setWholesalePrice}
                            refs={{ qty: qtyRef, cost: costRef, price: priceRef, wholesale: wholesaleRef }}
                            handleEnter={handleEnter}
                            showWholesale={showSingleWholesale}
                        />

                        {/* C. Actions */}
                        <ActionFields
                            expiry={expiry}
                            setExpiry={setExpiry}
                            handleAddItem={handleAddItem}
                            expiryRef={expiryRef}
                            addBtnRef={addBtnRef}
                            handleEnter={handleEnter}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}