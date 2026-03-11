"use client";

import { useSettings } from "@/lib/contexts/SettingsContext";
import { Upload, Trash2 } from "lucide-react";
import { useRef } from "react";

interface Props {
    label: string;
    value: string | null;
    onChange: (val: string | null) => void;
}

export default function ImageUploader({ label, value, onChange }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { t } = useSettings();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // The result is a Base64 string
                onChange(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="border border-gray-400 p-3 bg-white flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase text-gray-500">{label}</label>

            <div className="h-32 border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center relative overflow-hidden group">
                {value ? (
                    <img src={value} alt="Preview" className="w-full h-full object-contain p-2" />
                ) : (
                    <span className="text-gray-400 text-xs font-medium">No Image Selected</span>
                )}

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center gap-2 transition-all">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white p-2 rounded-full hover:bg-blue-50 text-blue-600"
                        title={t("upload")}
                    >
                        <Upload size={16} />
                    </button>
                    {value && (
                        <button
                            onClick={() => onChange(null)}
                            className="bg-white p-2 rounded-full hover:bg-red-50 text-red-600"
                            title={t("remove")}
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            </div>

            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    );
}