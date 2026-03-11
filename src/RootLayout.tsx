import { SettingsProvider } from "@/lib/contexts/SettingsContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-screen overflow-hidden overscroll-none bg-white">
      <SettingsProvider>{children}</SettingsProvider>
    </div>
  );
}
