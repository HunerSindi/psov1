"use client";

import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { useSettings } from "@/lib/contexts/SettingsContext";

const RATE_KEYS = { usd: "pos_calc_rate_usd", eur: "pos_calc_rate_eur", gbp: "pos_calc_rate_gbp", try: "pos_calc_rate_try", sar: "pos_calc_rate_sar" } as const;
const DEFAULT_RATES: Record<string, number> = { usd: 1500, eur: 1600, gbp: 1900, try: 45, sar: 400 };

type CurrencyTab = "iqd" | "usd" | "eur" | "gbp" | "try" | "sar";

interface MoneyOption {
    amount: number;
    src?: string;
    alt: string;
}

const IQD_OPTIONS: MoneyOption[] = [
    { amount: 250, src: "/money/IQD/250IQD.jpg", alt: "250 IQD" },
    { amount: 500, src: "/money/IQD/500IQD.jpg", alt: "500 IQD" },
    { amount: 1000, src: "/money/IQD/1000IQD.jpg", alt: "1,000 IQD" },
    { amount: 5000, src: "/money/IQD/5000IQD.png", alt: "5,000 IQD" },
    { amount: 10000, src: "/money/IQD/10000IQD.jpg", alt: "10,000 IQD" },
    { amount: 25000, src: "/money/IQD/25000IQD.jpg", alt: "25,000 IQD" },
    { amount: 50000, src: "/money/IQD/50000IQD.jpg", alt: "50,000 IQD" },
];

const USD_OPTIONS: MoneyOption[] = [
    { amount: 1, src: "/money/USD/1USD.jpg", alt: "$1" },
    { amount: 5, src: "/money/USD/5USD.jpg", alt: "$5" },
    { amount: 10, src: "/money/USD/10USD.jpg", alt: "$10" },
    { amount: 20, src: "/money/USD/20USD.jpg", alt: "$20" },
    { amount: 50, src: "/money/USD/50USD.jpg", alt: "$50" },
    { amount: 100, src: "/money/USD/100USD.jpg", alt: "$100" },
];

const EUR_OPTIONS: MoneyOption[] = [
    { amount: 1, src: "/money/EUR/1EUR.jpg", alt: "€1" },
    { amount: 5, src: "/money/EUR/5EUR.jpg", alt: "€5" },
    { amount: 10, src: "/money/EUR/10EUR.jpg", alt: "€10" },
    { amount: 20, src: "/money/EUR/20EUR.jpg", alt: "€20" },
    { amount: 50, src: "/money/EUR/50EUR.jpg", alt: "€50" },
    { amount: 100, src: "/money/EUR/100EUR.jpg", alt: "€100" },
];

const GBP_OPTIONS: MoneyOption[] = [
    { amount: 5, alt: "£5" },
    { amount: 10, alt: "£10" },
    { amount: 20, alt: "£20" },
    { amount: 50, alt: "£50" },
];

const TRY_OPTIONS: MoneyOption[] = [
    { amount: 5, alt: "5 ₺" },
    { amount: 10, alt: "10 ₺" },
    { amount: 20, alt: "20 ₺" },
    { amount: 50, alt: "50 ₺" },
    { amount: 100, alt: "100 ₺" },
    { amount: 200, alt: "200 ₺" },
];

const SAR_OPTIONS: MoneyOption[] = [
    { amount: 1, alt: "1 ﷼" },
    { amount: 5, alt: "5 ﷼" },
    { amount: 10, alt: "10 ﷼" },
    { amount: 50, alt: "50 ﷼" },
    { amount: 100, alt: "100 ﷼" },
    { amount: 500, alt: "500 ﷼" },
];

const CURRENCY_OPTIONS: Record<CurrencyTab, MoneyOption[]> = {
    iqd: IQD_OPTIONS,
    usd: USD_OPTIONS,
    eur: EUR_OPTIONS,
    gbp: GBP_OPTIONS,
    try: TRY_OPTIONS,
    sar: SAR_OPTIONS,
};

interface Props {
    ticketTotalIqd: number;
    onRefocusBarcode?: () => void;
}

const CURRENCY_TABS: CurrencyTab[] = ["iqd", "usd", "eur", "gbp", "try", "sar"];
const CURRENCY_TAB_STORAGE = "pos_calculator_currency_tab";
const SHOW_IN_CALC_KEYS: Record<CurrencyTab, string> = {
    iqd: "pos_calc_show_in_calc_iqd",
    usd: "pos_calc_show_in_calc_usd",
    eur: "pos_calc_show_in_calc_eur",
    gbp: "pos_calc_show_in_calc_gbp",
    try: "pos_calc_show_in_calc_try",
    sar: "pos_calc_show_in_calc_sar",
};

function getStoredCurrencyTab(): CurrencyTab {
    if (typeof window === "undefined") return "usd";
    const stored = localStorage.getItem(CURRENCY_TAB_STORAGE);
    if (stored && CURRENCY_TABS.includes(stored as CurrencyTab)) return stored as CurrencyTab;
    return "usd";
}

function getVisibleCurrencyTabs(): CurrencyTab[] {
    if (typeof window === "undefined") return CURRENCY_TABS;
    const list = CURRENCY_TABS.filter((tab) => {
        const stored = localStorage.getItem(SHOW_IN_CALC_KEYS[tab]);
        if (stored === "false") return false;
        return true;
    });
    return list.length > 0 ? list : CURRENCY_TABS;
}

export default function PriceCalculator({ ticketTotalIqd, onRefocusBarcode }: Props) {
    const { t } = useSettings();
    const [currencyTab, setCurrencyTab] = useState<CurrencyTab>(getStoredCurrencyTab);
    const [countsByAmount, setCountsByAmount] = useState<Record<number, number>>({});
    const [rates, setRates] = useState<Record<string, number>>(() => ({ ...DEFAULT_RATES }));

    useEffect(() => {
        const next: Record<string, number> = { ...DEFAULT_RATES };
        (Object.keys(RATE_KEYS) as (keyof typeof RATE_KEYS)[]).forEach((key) => {
            const stored = localStorage.getItem(RATE_KEYS[key]);
            if (stored != null) next[key] = Number(stored) || DEFAULT_RATES[key];
        });
        setRates(next);
    }, []);

    const visibleTabs = getVisibleCurrencyTabs();
    const effectiveTab = visibleTabs.length > 0 && visibleTabs.includes(currencyTab) ? currencyTab : visibleTabs[0] ?? "usd";

    useEffect(() => {
        const syncTabToVisible = () => {
            const visible = getVisibleCurrencyTabs();
            if (visible.length > 0 && !visible.includes(currencyTab)) {
                setCurrencyTab(visible[0]);
            }
        };
        syncTabToVisible();
        window.addEventListener("focus", syncTabToVisible);
        return () => window.removeEventListener("focus", syncTabToVisible);
    }, [currencyTab]);

    const options = CURRENCY_OPTIONS[effectiveTab];
    const paidAmount = options.reduce((sum, o) => sum + o.amount * (countsByAmount[o.amount] || 0), 0);

    const rate = effectiveTab === "iqd" ? 1 : rates[effectiveTab] ?? DEFAULT_RATES[effectiveTab];
    const paidIqd = paidAmount * rate;
    const returnIqd = Math.max(0, paidIqd - ticketTotalIqd);

    const addCount = (amount: number) => {
        setCountsByAmount((prev) => ({ ...prev, [amount]: (prev[amount] || 0) + 1 }));
        setTimeout(() => onRefocusBarcode?.(), 100);
    };

    const clearAmount = () => {
        setCountsByAmount({});
        setTimeout(() => onRefocusBarcode?.(), 100);
    };

    const setCurrencyTabAndStore = (tab: CurrencyTab) => {
        setCurrencyTab(tab);
        setCountsByAmount({});
        localStorage.setItem(CURRENCY_TAB_STORAGE, tab);
        setTimeout(() => onRefocusBarcode?.(), 100);
    };

    const symbol = effectiveTab === "iqd" ? "IQD" : effectiveTab === "usd" ? "$" : effectiveTab === "eur" ? "€" : effectiveTab === "gbp" ? "£" : effectiveTab === "try" ? "₺" : "﷼";

    return (
        <div className="flex flex-row-reverse h-full overflow-hidden gap-0">
            {/* Vertical currency tabs — left side */}
            <div className="flex flex-col border-r border-gray-400 shrink-0 w-16 bg-gray-50">
                {visibleTabs.map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => setCurrencyTabAndStore(tab)}
                        className={`py-2 px-1 text-[9px] font-bold uppercase border-b border-gray-400 last:border-b-0 flex items-center justify-center min-h-[40px] ${effectiveTab === tab ? "bg-gray-800 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                    >
                        {t(`sale_ticket.calculator.tab_${tab}`)}
                    </button>
                ))}
            </div>

            {/* Main content: grid + rate + return */}
            <div className="flex-1 flex flex-col min-w-0 p-2 gap-2">
                {/* Money cards — with image or text-only */}
                <div className="grid grid-cols-2 gap-2 flex-1 min-h-0 content-start overflow-auto">
                    {options.map(({ amount, src, alt }) => {
                        const count = countsByAmount[amount] || 0;
                        const hasImage = src != null && src !== "";
                        return (
                            <button
                                key={amount}
                                type="button"
                                onClick={() => addCount(amount)}
                                className="relative h-32 bg-white border border-gray-400 overflow-hidden hover:bg-gray-50 active:bg-gray-100"
                            >
                                {hasImage ? (
                                    <img
                                        src={src!}
                                        alt={alt}
                                        className="absolute inset-0 w-full h-full object-contain p-2"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-2xl font-bold font-mono text-gray-600">{alt}</span>
                                    </div>
                                )}
                                {count > 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                        <span className="text-5xl font-bold text-white drop-shadow-lg opacity-90">
                                            ×{count}
                                        </span>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Total paid + Return (big, green) + Clear */}
                <div className="shrink-0 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                        <div className="text-[10px] font-bold uppercase text-gray-600">
                            {t("sale_ticket.calculator.customer_pays")}
                        </div>
                        <div className="text-sm font-mono font-bold text-black">
                            {effectiveTab === "iqd"
                                ? `${paidAmount.toLocaleString()} IQD`
                                : `${symbol}${paidAmount.toLocaleString()} = ${paidIqd.toLocaleString()} IQD`}
                        </div>
                    </div>
                    <div className="flex items-stretch gap-2 min-h-[72px]">
                        <div className="flex-1 min-w-0 bg-green-600 border-2 border-green-800 p-3 text-center flex flex-col justify-center">
                            <div className="text-xs font-bold uppercase text-green-100">
                                {t("sale_ticket.calculator.return_to_customer")}
                            </div>
                            <div className="text-2xl font-bold font-mono text-white mt-1">
                                {returnIqd.toLocaleString()} IQD
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={clearAmount}
                            title={t("sale_ticket.calculator.clear")}
                            className="shrink-0 w-20 min-h-full flex items-center justify-center bg-red-600 border-2 border-red-800 text-white hover:bg-red-700"
                        >
                            <Trash2 size={32} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
