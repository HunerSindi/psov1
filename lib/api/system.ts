import { save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";

const API_URL = "http://127.0.0.1:8081";

export async function downloadSystemBackup() {
  try {
    // 1. Open "Save As" Dialog FIRST
    // This ensures we have a place to save before we start the heavy download
    const defaultName = `pos_backup_${new Date()
      .toISOString()
      .slice(0, 10)}.sql`;

    const filePath = await save({
      defaultPath: defaultName,
      filters: [{ name: "SQL Backup", extensions: ["sql"] }],
    });

    // If user cancelled the save dialog, stop here
    if (!filePath) return false;

    // 2. Start the Download
    const response = await fetch(`${API_URL}/system/backup`, {
      method: "GET",
    });

    // 3. Check for Server Error (Like the pg_dump error)
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server Error Log:", errorText); // This shows in your Inspect Element Console
      throw new Error(errorText);
    }

    // 4. Save the file using Tauri
    const buffer = await response.arrayBuffer();
    await writeFile(filePath, new Uint8Array(buffer));

    return true;
  } catch (error) {
    console.error("Backup failed:", error);
    return false;
  }
}
