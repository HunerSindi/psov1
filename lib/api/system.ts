const API_URL = "http://127.0.0.1:8081";

export async function downloadSystemBackup() {
  try {
    const defaultName = `pos_backup_${new Date()
      .toISOString()
      .slice(0, 10)}.sql`;

    const response = await fetch(`${API_URL}/system/backup`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server Error Log:", errorText);
      throw new Error(errorText);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = defaultName;
    a.click();
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("Backup failed:", error);
    return false;
  }
}
