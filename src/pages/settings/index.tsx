"use client";

import { useSettings } from "@/lib/contexts/SettingsContext";
import { Language } from "@/lib/i18n/translations";
import SettingsHeader from "./components/SettingsHeader";
import ImageUploader from "./components/ImageUploader";
import { Globe, Printer, Image as ImageIcon, Network, Usb } from "lucide-react";

export default function SettingsPage() {
  // IMPORTANT: Ensure your SettingsContext interface includes:
  // printerType: 'network' | 'usb';
  // printerName: string;
  // printerIp: string;
  const { settings, updateSettings, t } = useSettings();

  const handleSave = () => {
    alert(t("success"));
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 font-sans overflow-hidden">
      <SettingsHeader onSave={handleSave} />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* 1. Language Settings */}
          <div className="bg-white border border-gray-400 shadow-sm">
            <div className="bg-gray-100 border-b border-gray-400 p-3 flex items-center gap-2">
              <Globe size={18} className="text-blue-600" />
              <h2 className="text-sm font-bold uppercase text-gray-800">
                {t("general")}
              </h2>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                  {t("app_lang")}
                </label>
                <select
                  className="w-full border border-gray-400 p-2 text-sm outline-none focus:border-blue-600 bg-white"
                  value={settings.appLanguage}
                  onChange={(e) =>
                    updateSettings({ appLanguage: e.target.value as Language })
                  }
                >
                  <option value="en">English</option>
                  <option value="ar">العربية (Arabic)</option>
                  <option value="ku">کوردی (sorani)</option>
                  <option value="ku_bd">کوردی (badini)</option>

                </select>
              </div>
            </div>
          </div>

          {/* 2. Printing Preferences */}
          <div className="bg-white border border-gray-400 shadow-sm">
            <div className="bg-gray-100 border-b border-gray-400 p-3 flex items-center gap-2">
              <Printer size={18} className="text-blue-600" />
              <h2 className="text-sm font-bold uppercase text-gray-800">
                {t("printing")}
              </h2>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                  {t("print_a4_lang")}
                </label>
                <select
                  className="w-full border border-gray-400 p-2 text-sm outline-none focus:border-blue-600 bg-white"
                  value={settings.printA4Language}
                  onChange={(e) =>
                    updateSettings({
                      printA4Language: e.target.value as Language,
                    })
                  }
                >
                  <option value="en">English</option>
                  <option value="ar">العربية</option>
                  <option value="ku">کوردی</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                  {t("print_pos_lang")}
                </label>
                <select
                  className="w-full border border-gray-400 p-2 text-sm outline-none focus:border-blue-600 bg-white"
                  value={settings.printPosLanguage}
                  onChange={(e) =>
                    updateSettings({
                      printPosLanguage: e.target.value as Language,
                    })
                  }
                >
                  <option value="en">English</option>
                  <option value="ar">العربية</option>
                  <option value="ku">کوردی</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. UPDATED SECTION: Printer Connection */}
          <div className="bg-white border border-gray-400 shadow-sm">
            <div className="bg-gray-100 border-b border-gray-400 p-3 flex items-center gap-2">
              {/* Dynamically show icon based on type */}
              {settings.printerType === "usb" ? (
                <Usb size={18} className="text-blue-600" />
              ) : (
                <Network size={18} className="text-blue-600" />
              )}
              <h2 className="text-sm font-bold uppercase text-gray-800">
                {t("printer_connection") || "Printer Connection"}
              </h2>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Column 1: Connection Type Selector */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                  {t("connection_type") || "Connection Type"}
                </label>
                <select
                  className="w-full border border-gray-400 p-2 text-sm outline-none focus:border-blue-600 bg-white"
                  value={settings.printerType || "network"}
                  onChange={(e) =>
                    updateSettings({
                      printerType: e.target.value as "network" | "usb",
                    })
                  }
                >
                  <option value="network">Network (WiFi/Ethernet)</option>
                  <option value="usb">USB Connection</option>
                </select>
              </div>

              {/* Column 2: Dynamic Input (IP or Name) */}
              {settings.printerType === "usb" ? (
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                    {t("printer_name") || "USB Printer Name"}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. POS-80C or EPSON TM-T20"
                    className="w-full border border-gray-400 p-2 text-sm outline-none focus:border-blue-600 bg-white placeholder-gray-300"
                    value={settings.printerName || ""}
                    onChange={(e) =>
                      updateSettings({ printerName: e.target.value })
                    }
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    {t("printer_name_help") ||
                      "Enter the exact name of the printer as found in Windows Control Panel."}
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                    {t("printer_ip") || "Printer IP Address"}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 192.168.1.100"
                    className="w-full border border-gray-400 p-2 text-sm outline-none focus:border-blue-600 bg-white placeholder-gray-300"
                    value={settings.printerIp || ""}
                    onChange={(e) =>
                      updateSettings({ printerIp: e.target.value })
                    }
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    {t("printer_ip_help") ||
                      "Enter the Local IP address of your ESC/POS Thermal Printer."}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 4. Image Assets */}
          <div className="bg-white border border-gray-400 shadow-sm">
            <div className="bg-gray-100 border-b border-gray-400 p-3 flex items-center gap-2">
              <ImageIcon size={18} className="text-blue-600" />
              <h2 className="text-sm font-bold uppercase text-gray-800">
                {t("assets")}
              </h2>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
              <ImageUploader
                label={t("header_a4")}
                value={settings.headerA4}
                onChange={(val) => updateSettings({ headerA4: val })}
              />
              <ImageUploader
                label={t("footer_a4")}
                value={settings.footerA4}
                onChange={(val) => updateSettings({ footerA4: val })}
              />
              <ImageUploader
                label={t("header_pos")}
                value={settings.headerPos}
                onChange={(val) => updateSettings({ headerPos: val })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
