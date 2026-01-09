"use client";

import { useState } from "react";
import { useSettings } from "@/lib/contexts/SettingsContext";
import { downloadSystemBackup } from "@/lib/api/system";
import {
  DatabaseBackup,
  Download,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import BackupHeader from "./components/BackupHeader";

export default function BackupPage() {
  const { t } = useSettings();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleDownload = async () => {
    setLoading(true);
    setStatus("idle");

    try {
      const success = await downloadSystemBackup();
      if (success) {
        setStatus("success");
      } else {
        // If the user cancelled the save dialog, we usually stay 'idle' or show nothing,
        // but if it returned false due to error, set error.
        // For simplicity, let's assume false = error or cancel.
        // You can modify downloadSystemBackup to return specific codes if needed.
        console.log("Backup cancelled or failed");
        setStatus("idle");
      }
    } catch (e) {
      console.error(e);
      setStatus("error");
    }

    setLoading(false);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 font-sans">
      <BackupHeader />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white border-2 border-gray-300 rounded-xl shadow-lg max-w-lg w-full overflow-hidden">
          <div className="bg-gray-100 border-b border-gray-300 p-8 flex justify-center">
            <div className="bg-blue-100 p-6 rounded-full border-4 border-blue-200">
              <DatabaseBackup size={64} className="text-blue-700" />
            </div>
          </div>

          <div className="p-6 text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 uppercase">
              {t("backup.card_title")}
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm">
              {t("backup.desc")}
            </p>

            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md flex gap-3 items-start text-left">
              <AlertTriangle
                size={20}
                className="text-yellow-600 shrink-0 mt-0.5"
              />
              <span className="text-xs text-yellow-800 font-medium">
                {t("backup.warning")}
              </span>
            </div>

            {status === "success" && (
              <div className="text-green-600 font-bold text-sm flex items-center justify-center gap-2 animate-pulse">
                <CheckCircle size={16} /> {t("backup.success")}
              </div>
            )}
            {status === "error" && (
              <div className="text-red-600 font-bold text-sm">
                {t("backup.error")}
              </div>
            )}

            <button
              onClick={handleDownload}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 rounded-lg shadow-md transition-transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
              ) : (
                <Download size={20} />
              )}
              <span className="uppercase tracking-wider">
                {loading
                  ? t("backup.btn_processing")
                  : t("backup.btn_download")}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
