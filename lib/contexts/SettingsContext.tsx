"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, Language } from "@/lib/i18n/translations";

// --- 1. TYPE UTILITY FOR DOT NOTATION ---
type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
  ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
  : `${Key}`;
}[keyof ObjectType & (string | number)];

type TranslationKey = NestedKeyOf<typeof translations.en>;

interface Settings {
  appLanguage: Language;
  printA4Language: Language;
  printPosLanguage: Language;
  headerA4: string | null;
  footerA4: string | null;
  headerPos: string | null;
  printerIp?: string;
  printerType: "network" | "usb";
  printerName: string;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  t: (key: TranslationKey) => string;
  dir: "rtl" | "ltr";
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>({
    appLanguage: "en",
    printA4Language: "en",
    printPosLanguage: "en",
    headerA4: null,
    footerA4: null,
    headerPos: null,
    printerIp: "",
    printerType: "network",
    printerName: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("pos_settings");
    if (stored) {
      setSettings(JSON.parse(stored));
    }
  }, []);

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem("pos_settings", JSON.stringify(updated));
  };

  // --- 2. TRANSLATION HELPER ---
  const t = (key: TranslationKey): string => {
    const keys = key.split(".");
    let current: any = translations[settings.appLanguage];

    for (const k of keys) {
      if (!current || current[k] === undefined) {
        // Fallback to English if translation missing in current language
        let enFallback: any = translations["en"];
        for (const enK of keys) {
          enFallback = enFallback?.[enK];
        }
        return enFallback || key;
      }
      current = current[k];
    }

    return typeof current === "string" ? current : key;
  };

  // --- 3. UPDATED DIRECTION LOGIC ---
  // Added "ku_bd" to the RTL check
  const isRTL =
    settings.appLanguage === "ar" ||
    settings.appLanguage === "ku" ||
    settings.appLanguage === "ku_bd";

  const dir = isRTL ? "rtl" : "ltr";

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, t, dir }}>
      {/* 
         Apply the 'rtl' or 'ltr' direction and conditional font classes.
         Both Kurdish Sorani (ku) and Badini (ku_bd) use Arabic script, 
         so they use the Arabic font class.
      */}
      <div dir={dir} className={isRTL ? "font-arabic" : "font-sans"}>
        {children}
      </div>
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("useSettings must be used within SettingsProvider");
  return context;
};