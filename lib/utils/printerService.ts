import { toPng } from "html-to-image";

// Define the interface for the data stored in localStorage
interface StoredSettings {
  printerType?: "network" | "usb";
  printerIp?: string;
  printerName?: string;
  // other keys like appLanguage exist but we don't need them here
}

// REMOVED 'settings' from the arguments. It now reads from storage.
export const sendReceiptToPrinter = async (elementId: string) => {
  try {
    // 1. GET SETTINGS FROM LOCALSTORAGE
    const storedJson = localStorage.getItem("pos_settings");

    if (!storedJson) {
      console.error("Printer Error: 'pos_settings' not found in localStorage.");
      return false;
    }

    const settings: StoredSettings = JSON.parse(storedJson);

    // 2. Validate Element
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Printer Error: Element #${elementId} not found.`);
      return false;
    }

    // 3. Generate Base64 Image
    const base64Image = await toPng(element, {
      backgroundColor: "#ffffff",
      pixelRatio: 1,
      width: 576,
    });

    // 4. Prepare Payload based on stored settings
    // Default to 'network' if the type is missing
    const type = settings.printerType || "network";

    const payload = {
      type: type,
      // If type is network, use IP. If type is USB, IP is empty string.
      printer_ip: type === "network" ? settings.printerIp || "" : "",
      // If type is USB, use Name. If type is Network, Name is empty string.
      printer_name: type === "usb" ? settings.printerName || "" : "",
      image_base64: base64Image,
    };

    console.log("Loaded settings from Storage:", settings);
    console.log("Sending payload to printer:", payload);

    // 5. Send to Local Backend
    const response = await fetch("http://127.0.0.1:8081/printing/receipt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Print Service Error: ${response.statusText}`);
    }

    console.log("Print sent successfully!");
    return true;
  } catch (error) {
    console.error("Failed to print receipt:", error);
    return false;
  }
};
