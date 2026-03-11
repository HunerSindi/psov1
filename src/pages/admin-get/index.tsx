"use client";

import { useState } from "react";
import { generateLicenseKey } from "@/util/licenseManager";

export default function AdminGenerator() {
    const [clientDeviceId, setClientDeviceId] = useState<string>("");
    const [generatedKey, setGeneratedKey] = useState<string>("");

    const handleGenerate = () => {
        if (!clientDeviceId) return;
        const key = generateLicenseKey(clientDeviceId);
        setGeneratedKey(key);
    };

    return (
        <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-10">
            <h1 className="text-3xl font-bold mb-6">🔑 Admin Key Generator</h1>

            <div className="w-full max-w-lg border p-6 rounded shadow-lg">
                <label className="block mb-2 font-bold">Client's Device ID:</label>
                <input
                    type="text"
                    value={clientDeviceId}
                    onChange={(e) => setClientDeviceId(e.target.value)}
                    placeholder="Paste client ID here..."
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />

                <button
                    onClick={handleGenerate}
                    className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
                >
                    Generate Key
                </button>

                {generatedKey && (
                    <div className="mt-8 p-4 bg-green-100 border border-green-500 rounded">
                        <p className="text-sm text-green-800 font-bold mb-1">Send this key to client:</p>
                        <p className="text-2xl font-mono select-all">{generatedKey}</p>
                    </div>
                )}
            </div>
        </div>
    );
}