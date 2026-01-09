"use client";

import { useState, useEffect, FormEvent } from "react";
import { getDeviceId, activateApp } from "../util/licenseManager";
import { CheckCircle2 } from "lucide-react"; // Optional: Icon for the dialog
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Props {
    onActivate: () => void;
}

export default function ActivationPage({ onActivate }: Props) {
    const [deviceId, setDeviceId] = useState<string>("");
    const [inputKey, setInputKey] = useState<string>("");
    const [error, setError] = useState<string>("");

    // State to control the Dialog visibility
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        // Load device ID on mount
        setDeviceId(getDeviceId());
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(deviceId);
        // Instead of alert, we open the dialog
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const success = activateApp(inputKey);

        if (success) {
            onActivate(); // Tell parent component we are done
        } else {
            setError("Invalid License Key. This key does not match this device.");
        }
    };

    return (
        // Main Background
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-gray-900 p-6">

            {/* --- SHADCN DIALOG COMPONENT --- */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-white text-center">
                    <DialogHeader className="flex flex-col items-center justify-center gap-2">
                        <div className="p-3 bg-green-100 rounded-full">
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                        </div>
                        <DialogTitle className="text-xl">Copied!</DialogTitle>
                        <DialogDescription className="text-gray-500">
                            Device ID has been copied to your clipboard.
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            {/* ------------------------------- */}

            {/* Card: White background, soft shadow, light border */}
            <div className="w-full max-w-md p-8 bg-white rounded-xl border border-gray-200 shadow-xl">
                <h1 className="text-2xl font-bold mb-2 text-blue-600">
                    Activation Required
                </h1>
                <p className="text-sm text-gray-600 mb-8">+964 750 494 8861</p>

                {/* Device ID Display */}
                <div className="mb-6">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                        Your Device ID
                    </label>
                    <div className="flex mt-2 gap-2">
                        {/* Code Block */}
                        <code className="flex-1 bg-gray-100 border border-gray-300 p-3 rounded-lg text-gray-800 font-mono text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                            {deviceId || "Loading..."}
                        </code>
                        <button
                            onClick={handleCopy}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition shadow-sm"
                        >
                            Copy
                        </button>
                    </div>
                </div>

                {/* Input Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                            Enter License Key
                        </label>
                        <input
                            type="text"
                            value={inputKey}
                            onChange={(e) => setInputKey(e.target.value)}
                            placeholder="XXXX-XXXX-XXXX"
                            className="w-full mt-2 p-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 text-sm text-center p-2 rounded">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition shadow-md hover:shadow-lg mt-2"
                    >
                        ACTIVATE NOW
                    </button>
                </form>
            </div>
        </div>
    );
}