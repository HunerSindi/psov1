import SHA256 from "crypto-js/sha256";

const SECRET_SALT = "533f7fc1783583011f8f721d7d67f230c4f436a6cbe13cd2d00db9a886bfaa37";

export interface LicenseData {
    deviceId: string;
    licenseKey: string;
}

// 1. Get or Create a Unique Device ID
export const getDeviceId = (): string => {
    if (typeof window === "undefined") return ""; // Server-side guard

    let id = localStorage.getItem("device_unique_id");

    if (!id) {
        // Generate a new UUID for this specific browser/machine
        id = crypto.randomUUID();
        localStorage.setItem("device_unique_id", id);
    }
    return id;
};

// 2. Generate the "Correct" Key for a specific Device ID
// Formula: Hash(DeviceID + SecretSalt) = LicenseKey
export const generateLicenseKey = (deviceId: string): string => {
    if (!deviceId) return "";

    const rawString = deviceId + SECRET_SALT;
    const hash = SHA256(rawString).toString();

    // Return first 12 chars in uppercase (e.g., "A1B2-C3D4-E5F6")
    return hash.substring(0, 12).toUpperCase();
};

// 3. Verify if the app is currently activated
export const verifyActivation = (): boolean => {
    if (typeof window === "undefined") return false;

    const storedDataStr = localStorage.getItem("app_license");
    if (!storedDataStr) return false;

    try {
        const storedData: LicenseData = JSON.parse(storedDataStr);
        const currentDeviceId = getDeviceId();

        // CHECK 1: Is this the same computer? (Prevents copying files)
        if (storedData.deviceId !== currentDeviceId) {
            return false;
        }

        // CHECK 2: Is the key mathematically correct?
        const expectedKey = generateLicenseKey(currentDeviceId);
        return storedData.licenseKey === expectedKey;

    } catch (error) {
        return false;
    }
};

// 4. Save activation
export const activateApp = (key: string): boolean => {
    const currentDeviceId = getDeviceId();
    const expectedKey = generateLicenseKey(currentDeviceId);

    if (key.trim().toUpperCase() === expectedKey) {
        const data: LicenseData = {
            deviceId: currentDeviceId,
            licenseKey: expectedKey
        };
        localStorage.setItem("app_license", JSON.stringify(data));
        return true;
    }

    return false;
};