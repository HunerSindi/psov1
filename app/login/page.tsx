"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api/auth";
import { Delete, AlertCircle } from "lucide-react";

// 1. Import Shadcn OTP components
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
    InputOTPSlotPassword,
} from "@/components/ui/input-otp";

// 2. Import Shadcn Dialog components
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component

export default function LoginPage() {
    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(false);
    const [isErrorOpen, setIsErrorOpen] = useState(false); // Controls Dialog visibility
    const router = useRouter();

    // --- Auto-Submit Logic ---
    useEffect(() => {
        if (pin.length === 6) {
            handleLogin(pin);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pin]);

    const handleLogin = async (codeToCheck: string) => {
        if (loading) return; // Prevent double submission
        setLoading(true);

        try {
            // Slight delay just for UX feel so it doesn't flash too fast
            // await new Promise(r => setTimeout(r, 300)); 

            const user = await loginUser(codeToCheck);

            if (user) {
                localStorage.setItem("pos_user", JSON.stringify(user));
                router.push("/dashboard");
            } else {
                // Login Failed: Clear pin and show Dialog
                setPin("");
                setIsErrorOpen(true);
            }
        } catch (err) {
            setPin("");
            setIsErrorOpen(true);
        } finally {
            setLoading(false);
        }
    };

    // --- Keypad Logic ---
    const handleKeypadPress = (num: string) => {
        if (pin.length < 6) {
            setPin((prev) => prev + num);
        }
    };

    const handleBackspace = () => {
        setPin((prev) => prev.slice(0, -1));
    };

    return (
        <div className="min-h-screen flex items-center justify-center " dir="ltr">
            <div className="w-full max-w-md bg-white p-6 md:p-8  flex flex-col items-center">

                {/* --- INPUT DISPLAY --- */}
                <div className="mb-8 relative">
                    <InputOTP
                        maxLength={6}
                        value={pin}
                        onChange={(value) => setPin(value)}
                        disabled={loading}
                        autoFocus={true}
                    >
                        <InputOTPGroup>
                            <InputOTPSlotPassword index={0} className="w-12 h-12 text-2xl font-bold" />
                            <InputOTPSlotPassword index={1} className="w-12 h-12 text-2xl font-bold" />
                            <InputOTPSlotPassword index={2} className="w-12 h-12 text-2xl font-bold" />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                            <InputOTPSlotPassword index={3} className="w-12 h-12 text-2xl font-bold" />
                            <InputOTPSlotPassword index={4} className="w-12 h-12 text-2xl font-bold" />
                            <InputOTPSlotPassword index={5} className="w-12 h-12 text-2xl font-bold" />
                        </InputOTPGroup>
                    </InputOTP>
                </div>

                {/* --- NUMERIC KEYPAD --- */}
                <div className="grid grid-cols-3 gap-3 w-full max-w-[240px] mb-4 select-none">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <button
                            key={num}
                            type="button"
                            onClick={() => handleKeypadPress(num.toString())}
                            disabled={loading}
                            className="h-16 w-full bg-white rounded-xl text-2xl font-medium text-gray-800 hover:bg-gray-50 active:bg-gray-100 active:scale-95 transition-all shadow-sm border border-gray-200"
                        >
                            {num}
                        </button>
                    ))}

                    {/* Zero (Spans 2 cols) */}
                    <button
                        type="button"
                        onClick={() => handleKeypadPress("0")}
                        disabled={loading}
                        className="col-span-2 h-16 w-full bg-white rounded-xl text-2xl font-medium text-gray-800 hover:bg-gray-50 active:bg-gray-100 active:scale-95 transition-all shadow-sm border border-gray-200"
                    >
                        0
                    </button>

                    {/* Backspace / Clear */}
                    <button
                        type="button"
                        onClick={handleBackspace}
                        disabled={loading}
                        className="h-16 w-full flex items-center justify-center bg-gray-50 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 active:scale-95 transition-all shadow-sm border border-gray-200"
                    >
                        <Delete size={24} />
                    </button>
                </div>
            </div>

            {/* --- ERROR DIALOG --- */}
            <Dialog open={isErrorOpen} onOpenChange={setIsErrorOpen}>
                <DialogContent className="sm:max-w-xs text-center">
                    <DialogHeader className="flex flex-col items-center justify-center gap-2">
                        <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-2">
                            <AlertCircle size={24} />
                        </div>
                        <DialogTitle className="text-lg">Access Denied</DialogTitle>
                        <DialogDescription>
                            The PIN code you entered is incorrect. Please try again.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-center mt-2">
                        <Button
                            variant="default"
                            className="w-full bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => setIsErrorOpen(false)}
                        >
                            Try Again
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}