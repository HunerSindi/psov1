"use client";

import React, { useEffect, useState, useRef } from "react";
import { Item, UNIT_TYPES } from "../config/types";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, Dices, Plus, Settings } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { getCompanies } from "@/lib/api/companies";
import { getProductCategories, createProductCategory } from "@/lib/api/items";
import type { Company } from "@/lib/api/companies";
import type { ProductCategory } from "@/lib/api/items";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
    item: Item;
    handleChange: (field: keyof Item, value: any) => void;
    searchBarcode: string;
    setSearchBarcode: (val: string) => void;
    handleScan: (e: React.FormEvent) => void;
    msg: string;
    refs: {
        nameRef: React.RefObject<HTMLInputElement | null>;
        dateRef: React.RefObject<HTMLInputElement | null>;
        alertRef: React.RefObject<HTMLInputElement | null>;
        unitRef: React.RefObject<HTMLSelectElement | null>;
    };
    onEnter: (current: string) => void;
    onFocusSelect: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export default function BasicInfo({
    item,
    handleChange,
    searchBarcode,
    setSearchBarcode,
    handleScan,
    msg,
    refs,
    onEnter,
    onFocusSelect,
}: Props) {
    const { t, dir } = useSettings();
    const navigate = useNavigate();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [companyInput, setCompanyInput] = useState("");
    const [categoryInput, setCategoryInput] = useState("");
    const [companyOpen, setCompanyOpen] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [addCategoryOpen, setAddCategoryOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [addingCategory, setAddingCategory] = useState(false);
    const companyWrapRef = useRef<HTMLDivElement>(null);
    const categoryWrapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        getCompanies("", 1, 500).then((res) => setCompanies(res?.data ?? []));
        getProductCategories().then(setCategories);
    }, []);

    useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            if (companyWrapRef.current && !companyWrapRef.current.contains(e.target as Node)) setCompanyOpen(false);
            if (categoryWrapRef.current && !categoryWrapRef.current.contains(e.target as Node)) setCategoryOpen(false);
        };
        document.addEventListener("click", onDocClick);
        return () => document.removeEventListener("click", onDocClick);
    }, []);

    const MAX_SUGGESTIONS = 5;
    const companyDisplay = item.company_id != null
        ? (companies.find((c) => c.id === item.company_id)?.name ?? "")
        : companyInput;
    const categoryDisplay = item.category_id != null
        ? (categories.find((c) => c.id === item.category_id)?.name ?? "")
        : categoryInput;
    const companySuggestions = companies
        .filter((c) => c.name.toLowerCase().includes(companyInput.trim().toLowerCase()))
        .slice(0, MAX_SUGGESTIONS);
    const categorySuggestions = categories
        .filter((c) => c.name.toLowerCase().includes(categoryInput.trim().toLowerCase()))
        .slice(0, MAX_SUGGESTIONS);

    const handleAddCategory = async () => {
        const name = newCategoryName.trim();
        if (!name) return;
        setAddingCategory(true);
        const created = await createProductCategory(name);
        setAddingCategory(false);
        if (created) {
            setCategories((prev) => (prev.some((c) => c.id === created.id) ? prev : [...prev, created]));
            handleChange("category_id", created.id);
            setNewCategoryName("");
            setAddCategoryOpen(false);
            setCategoryInput("");
            setCategoryOpen(false);
        }
    };

    const generateRandomBarcode = () => {
        const randomCode = Math.floor(100000000 + Math.random() * 900000000).toString();
        setSearchBarcode(randomCode);
    };

    // --- TRIGGER ON BLUR ---
    // This wrapper allows us to call handleScan without a real form event
    const handleBlur = () => {
        // Only trigger if there is actual text to search
        if (searchBarcode && searchBarcode.trim() !== "") {
            const mockEvent = { preventDefault: () => { } } as React.FormEvent;
            handleScan(mockEvent);
        }
    };

    const getUnitLabel = (type: string) => {
        switch (type) {
            case "single": return t("define_item.unit_single");
            case "single-wholesale": return t("define_item.unit_wholesale");
            case "single-packet": return t("define_item.unit_packet");
            case "single-packet-wholesale": return t("define_item.unit_packet_wholesale");
            case "kg": return t("define_item.unit_kg");
            case "cm": return t("define_item.unit_cm");
            case "m": return t("define_item.unit_m");
            default: return type;
        }
    };

    return (
        <div className="bg-white border border-gray-400 flex flex-col h-full">
            <div className="bg-gray-100 border-b border-gray-400 p-3">
                <h2 className="font-bold text-sm uppercase text-gray-700 tracking-wide">
                    {t("define_item.basic_info")}
                </h2>
            </div>

            <div className="p-4 flex flex-col gap-4 flex-1 min-h-0">
                {/* SCANNER */}
                <div className="bg-blue-50 border border-blue-200 p-3">
                    <form onSubmit={handleScan} className="flex w-full">
                        <button
                            type="button"
                            onClick={generateRandomBarcode}
                            title={t("define_item.random_barcode_title")}
                            className="shrink-0 bg-gray-200 text-gray-800 px-3 h-10 font-bold text-sm uppercase hover:bg-gray-300 border-gray-400 border transition-colors rounded-none flex items-center gap-1"
                        >
                            <Dices size={16} />
                        </button>

                        <input
                            autoFocus
                            type="text"
                            placeholder={t("define_item.search_placeholder")}
                            value={searchBarcode}
                            onChange={(e) => setSearchBarcode(e.target.value)}
                            onFocus={onFocusSelect}

                            // --- CHANGE: Trigger only on Blur (Focus lost) ---
                            onBlur={handleBlur}

                            className="flex-1 w-full min-w-0 h-10 border border-gray-400 px-3 text-lg font-mono outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-none placeholder:text-sm"
                        />

                        <button
                            type="submit"
                            className={`shrink-0 bg-black text-white px-4 h-10 font-bold text-sm uppercase hover:bg-gray-800 border border-black transition-colors rounded-none ${dir === 'rtl' ? 'border-r-0' : 'border-l-0'}`}
                        >
                            {t("define_item.scan_btn")}
                        </button>
                    </form>

                    {msg && (
                        <div className={`mt-2 flex items-center gap-2 text-xs font-bold uppercase ${msg.includes("Error") ? "text-red-600" : "text-green-700"}`}>
                            {msg.includes("Error") ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
                            {msg}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-4">

                    {/* UNIT TYPE SELECT */}
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                            {t("define_item.unit_type")}
                        </label>
                        <Select
                            value={item.unit_type}
                            onValueChange={(val) => handleChange("unit_type", val)}
                            dir={dir}
                        >
                            <SelectTrigger className="w-full h-9 rounded-none border-gray-400 focus:ring-0 focus:border-blue-600 bg-white shadow-none">
                                <SelectValue placeholder={t("define_item.select_unit_placeholder")} />
                            </SelectTrigger>
                            <SelectContent className="rounded-none border-gray-400">
                                {UNIT_TYPES.map((type) => (
                                    <SelectItem
                                        key={type}
                                        value={type}
                                        className="rounded-none focus:bg-gray-100 cursor-pointer font-medium"
                                    >
                                        {getUnitLabel(type)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* NAME */}
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                            {t("define_item.name")}
                        </label>
                        <input
                            ref={refs.nameRef}
                            type="text"
                            value={item.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && onEnter("name")}
                            onFocus={onFocusSelect}
                            className="w-full h-9 border border-gray-400 px-2 text-sm rounded-none focus:border-blue-600 focus:outline-none focus:bg-blue-50 transition-colors"
                            placeholder={t("define_item.name_placeholder")}
                        />
                    </div>

                    {/* DATE */}
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                            {t("define_item.expiry_date")}
                        </label>
                        <input
                            ref={refs.dateRef}
                            type="date"
                            value={item.expiration_date || ""}
                            onChange={(e) => handleChange("expiration_date", e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && onEnter("date")}
                            className="w-full h-9 border border-gray-400 px-2 text-sm rounded-none focus:border-blue-600 focus:outline-none uppercase"
                        />
                    </div>

                    {/* ALERT */}
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                            {t("define_item.alert_qty")}
                        </label>
                        <input
                            ref={refs.alertRef}
                            type="number"
                            value={item.alert_quantity}
                            onChange={(e) => handleChange("alert_quantity", Number(e.target.value))}
                            onKeyDown={(e) => e.key === "Enter" && onEnter("alert")}
                            onFocus={onFocusSelect}
                            className="w-full h-9 border border-gray-400 px-2 text-sm rounded-none focus:border-blue-600 focus:outline-none"
                        />
                    </div>

                    {/* COMPANY (optional) – type-ahead, max 5 suggestions – at bottom */}
                    <div ref={companyWrapRef} className="relative">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                            {t("define_item.company" as any)}
                        </label>
                        <input
                            type="text"
                            value={companyDisplay}
                            onChange={(e) => {
                                const v = e.target.value;
                                setCompanyInput(v);
                                setCompanyOpen(true);
                                if (!v) handleChange("company_id", null);
                                else if (item.company_id != null) handleChange("company_id", null);
                            }}
                            onFocus={() => setCompanyOpen(companyInput.trim().length >= 1)}
                            placeholder={t("define_item.company_placeholder" as any)}
                            className="w-full h-9 border border-gray-400 px-2 text-sm rounded-none focus:border-blue-600 focus:outline-none focus:bg-blue-50 transition-colors"
                        />
                        {companyOpen && companyInput.trim().length >= 1 && (
                            <ul className="absolute z-50 top-full left-0 right-0 mt-0.5 bg-white border border-gray-400 shadow-lg max-h-40 overflow-auto rounded-none">
                                {companySuggestions.length === 0 ? (
                                    <li className="px-2 py-2 text-xs text-gray-500">{t("define_item.no_results" as any)}</li>
                                ) : (
                                    companySuggestions.map((c) => (
                                        <li
                                            key={c.id ?? c.name}
                                            className="px-2 py-2 text-sm cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-0"
                                            onClick={() => {
                                                handleChange("company_id", c.id ?? null);
                                                setCompanyInput("");
                                                setCompanyOpen(false);
                                            }}
                                        >
                                            {c.name}
                                        </li>
                                    ))
                                )}
                            </ul>
                        )}
                    </div>

                    {/* CATEGORY (optional) – type-ahead, max 5 suggestions + Add + Settings */}
                    <div ref={categoryWrapRef} className="relative">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                            {t("define_item.category" as any)}
                        </label>
                        <div className="flex gap-1">
                            <input
                                type="text"
                                value={categoryDisplay}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    setCategoryInput(v);
                                    setCategoryOpen(true);
                                    if (!v) handleChange("category_id", null);
                                    else if (item.category_id != null) handleChange("category_id", null);
                                }}
                                onFocus={() => setCategoryOpen(categoryInput.trim().length >= 1)}
                                placeholder={t("define_item.category_placeholder" as any)}
                                className="flex-1 min-w-0 h-9 border border-gray-400 px-2 text-sm rounded-none focus:border-blue-600 focus:outline-none focus:bg-blue-50 transition-colors"
                            />
                            <button
                                type="button"
                                title={t("define_item.add_category" as any)}
                                onClick={() => setAddCategoryOpen(true)}
                                className="shrink-0 h-9 w-9 flex items-center justify-center border border-gray-400 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-none transition-colors"
                            >
                                <Plus size={18} />
                            </button>
                            <button
                                type="button"
                                title={t("define_item.category_settings" as any)}
                                onClick={() => navigate("/categories-items")}
                                className="shrink-0 h-9 w-9 flex items-center justify-center border border-gray-400 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-none transition-colors"
                            >
                                <Settings size={18} />
                            </button>
                        </div>
                        {categoryOpen && categoryInput.trim().length >= 1 && (
                            <ul className="absolute z-50 top-full left-0 right-0 mt-0.5 bg-white border border-gray-400 shadow-lg max-h-40 overflow-auto rounded-none">
                                {categorySuggestions.length === 0 ? (
                                    <li className="px-2 py-2 text-xs text-gray-500">{t("define_item.no_results" as any)}</li>
                                ) : (
                                    categorySuggestions.map((cat) => (
                                        <li
                                            key={cat.id}
                                            className="px-2 py-2 text-sm cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-0"
                                            onClick={() => {
                                                handleChange("category_id", cat.id);
                                                setCategoryInput("");
                                                setCategoryOpen(false);
                                            }}
                                        >
                                            {cat.name}
                                        </li>
                                    ))
                                )}
                            </ul>
                        )}
                    </div>

                    {/* Add category dialog */}
                    <Dialog open={addCategoryOpen} onOpenChange={setAddCategoryOpen}>
                        <DialogContent className="bg-white rounded-sm border-gray-400 max-w-sm">
                            <DialogHeader>
                                <DialogTitle className="text-sm font-bold uppercase">{t("define_item.add_category" as any)}</DialogTitle>
                            </DialogHeader>
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder={t("define_item.category_name_placeholder" as any)}
                                className="w-full h-9 border border-gray-400 px-2 text-sm rounded-none focus:border-blue-600 focus:outline-none"
                                onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                            />
                            <DialogFooter className="gap-2">
                                <Button variant="outline" size="sm" onClick={() => setAddCategoryOpen(false)} className="rounded-none">
                                    {t("define_item.cancel" as any)}
                                </Button>
                                <Button size="sm" onClick={handleAddCategory} disabled={!newCategoryName.trim() || addingCategory} className="rounded-none">
                                    {addingCategory ? t("define_item.saving" as any) : t("define_item.save_btn")}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                </div>
            </div>
        </div>
    );
}