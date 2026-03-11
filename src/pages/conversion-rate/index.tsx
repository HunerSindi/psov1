"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { ArrowLeft, TrendingUp } from "lucide-react";

const RATE_KEYS = { usd: "pos_calc_rate_usd", eur: "pos_calc_rate_eur", gbp: "pos_calc_rate_gbp", try: "pos_calc_rate_try", sar: "pos_calc_rate_sar" } as const;
const SHOW_IN_CALC_KEYS = { iqd: "pos_calc_show_in_calc_iqd", usd: "pos_calc_show_in_calc_usd", eur: "pos_calc_show_in_calc_eur", gbp: "pos_calc_show_in_calc_gbp", try: "pos_calc_show_in_calc_try", sar: "pos_calc_show_in_calc_sar" } as const;
const DEFAULT_RATES: Record<keyof typeof RATE_KEYS, number> = { usd: 1500, eur: 1600, gbp: 1900, try: 45, sar: 400 };
const DEFAULT_SHOW_IN_CALC: Record<keyof typeof SHOW_IN_CALC_KEYS, boolean> = { iqd: true, usd: true, eur: true, gbp: true, try: true, sar: true };

type RateKey = keyof typeof RATE_KEYS;
type ShowInCalcKey = keyof typeof SHOW_IN_CALC_KEYS;

function getStoredShowInCalc(key: ShowInCalcKey): boolean {
  if (typeof window === "undefined") return DEFAULT_SHOW_IN_CALC[key];
  const stored = localStorage.getItem(SHOW_IN_CALC_KEYS[key]);
  if (stored === "true") return true;
  if (stored === "false") return false;
  return DEFAULT_SHOW_IN_CALC[key];
}

const RATE_CURRENCIES: RateKey[] = ["usd", "eur", "gbp", "try", "sar"];
const ALL_CALC_CURRENCIES: ShowInCalcKey[] = ["iqd", "usd", "eur", "gbp", "try", "sar"];

export default function ConversionRatePage() {
  const navigate = useNavigate();
  const { t, dir } = useSettings();
  const [rates, setRates] = useState<Record<RateKey, number>>(DEFAULT_RATES);
  const [showInCalc, setShowInCalc] = useState<Record<ShowInCalcKey, boolean>>(DEFAULT_SHOW_IN_CALC);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const nextRates = { ...DEFAULT_RATES };
    RATE_CURRENCIES.forEach((key) => {
      const stored = localStorage.getItem(RATE_KEYS[key]);
      if (stored != null) nextRates[key] = Number(stored) || DEFAULT_RATES[key];
    });
    setRates(nextRates);

    const nextShow = { ...DEFAULT_SHOW_IN_CALC };
    ALL_CALC_CURRENCIES.forEach((key) => {
      nextShow[key] = getStoredShowInCalc(key);
    });
    setShowInCalc(nextShow);
  }, []);

  const handleChange = (key: RateKey, value: string) => {
    setRates((prev) => ({ ...prev, [key]: Number(value) || 0 }));
    setSaved(false);
  };

  const handleShowInCalcToggle = (key: ShowInCalcKey) => {
    const next = !showInCalc[key];
    setShowInCalc((prev) => ({ ...prev, [key]: next }));
    localStorage.setItem(SHOW_IN_CALC_KEYS[key], String(next));
  };

  const handleSave = () => {
    RATE_CURRENCIES.forEach((key) => localStorage.setItem(RATE_KEYS[key], String(rates[key])));
    ALL_CALC_CURRENCIES.forEach((key) => localStorage.setItem(SHOW_IN_CALC_KEYS[key], String(showInCalc[key])));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 font-sans overflow-hidden">
      {/* Header — fixed */}
      <header className="shrink-0 bg-blue-600 border-b border-gray-400 p-3 flex justify-between items-center z-30 shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="text-white font-bold hover:text-black transition-colors uppercase text-sm flex items-center gap-1"
          >
            <span className="text-xl pb-1">
              {dir === "rtl" ? <>&rarr;</> : <ArrowLeft size={16} />}
            </span>
            {t("dashboard")}
          </button>
          <div className="h-6 w-px bg-gray-300 opacity-50" />
          <div className="flex items-center gap-2 text-white">
            <TrendingUp size={20} />
            <h1 className="font-bold uppercase tracking-tight">
              {t("conversion_rate.title")}
            </h1>
          </div>
        </div>
      </header>

      {/* Scrollable content — desktop-friendly */}
      <main className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          <p className="text-sm text-gray-600 mb-6">
            {t("conversion_rate.subtitle")}
          </p>

          {/* Exchange rates — grid on desktop */}
          <section className="mb-8">
            <h2 className="text-xs font-bold uppercase text-gray-500 mb-3">Exchange rates (1 unit = ? IQD)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {RATE_CURRENCIES.map((key) => (
                <div key={key} className="bg-white border border-gray-400 shadow-sm p-4 rounded flex flex-col gap-3">
                  <label className="text-xs font-bold uppercase text-gray-600">
                    {t(`conversion_rate.${key}`)}
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={rates[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="w-full h-10 border border-gray-400 px-3 text-sm font-mono"
                  />
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showInCalc[key]}
                      onChange={() => handleShowInCalcToggle(key)}
                      className="w-4 h-4"
                    />
                    <span className="text-xs font-bold text-gray-700">{t("conversion_rate.show_in_calculator")}</span>
                  </label>
                </div>
              ))}
            </div>
          </section>

          {/* IQD — show in calculator only */}
          <section className="mb-8">
            <h2 className="text-xs font-bold uppercase text-gray-500 mb-3">Price Calculator tabs</h2>
            <div className="bg-white border border-gray-400 shadow-sm p-4 rounded">
              <p className="text-xs font-bold uppercase text-gray-600 mb-2">IQD</p>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showInCalc.iqd}
                  onChange={() => handleShowInCalcToggle("iqd")}
                  className="w-4 h-4"
                />
                <span className="text-xs font-bold text-gray-700">{t("conversion_rate.show_in_calculator")}</span>
              </label>
            </div>
          </section>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="w-full max-w-xs py-3 bg-blue-600 text-white font-bold uppercase border border-blue-700 hover:bg-blue-700"
            >
              {t("conversion_rate.save")}
            </button>
            {saved && (
              <p className="text-sm font-bold text-green-600">
                {t("conversion_rate.saved")}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
