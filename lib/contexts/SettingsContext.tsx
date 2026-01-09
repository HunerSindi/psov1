"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, Language } from "@/lib/i18n/translations";

// --- 1. TYPE UTILITY FOR DOT NOTATION ---
// This recursively builds types like "general" | "define_item.title" | "define_item.save_btn"
type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

// The valid keys based on English translations
type TranslationKey = NestedKeyOf<typeof translations.en>;

interface Settings {
  appLanguage: Language;
  printA4Language: Language;
  printPosLanguage: Language;
  headerA4: string | null;
  footerA4: string | null;
  headerPos: string | null;
  printerIp?: string;
  printerType: "network" | "usb"; // <--- Add this
  printerName: string; // <--- Add this
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  t: (key: TranslationKey) => string; // Updated type definition
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
    printerType: "network", // <--- Default to network
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

  // --- 2. UPDATED TRANSLATION HELPER ---
  // Handles splitting "define_item.title" into ["define_item", "title"] and traversing the object
  const t = (key: TranslationKey): string => {
    const keys = key.split(".");
    let current: any = translations[settings.appLanguage];

    for (const k of keys) {
      if (current[k] === undefined) {
        // Fallback to English if translation missing
        // Optional: remove this fallback block if you don't want it
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

  const dir =
    settings.appLanguage === "ar" || settings.appLanguage === "ku"
      ? "rtl"
      : "ltr";

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, t, dir }}>
      <div dir={dir} className={dir === "rtl" ? "font-arabic" : "font-sans"}>
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
