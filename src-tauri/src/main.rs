#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")] // Hides the black console window in production

use tauri::path::BaseDirectory;
use tauri::Manager;
use tauri_plugin_shell::ShellExt; // Required for Tauri V2

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            // 1. Get path to the bundled Node binary
            let sidecar_command = app.shell().sidecar("node").unwrap();

            // 2. Find the "server" folder inside the resources
            // FIXED: Using 'resolve' with 'BaseDirectory::Resource' for Tauri V2
            let resource_path = app
                .path()
                .resolve("server/server.js", BaseDirectory::Resource)
                .expect("failed to resolve resource");

            // 3. Convert path to string AND FIX WINDOWS BUG
            // Windows paths often start with "\\?\" which crashes Node.js. We remove it.
            let script_path = resource_path.to_string_lossy().replace("\\\\?\\", "");

            // 4. Launch: node.exe "C:\Path\To\server.js"
            let (mut rx, _) = sidecar_command
                .args(&[script_path])
                .spawn()
                .expect("Failed to spawn sidecar");

            // 5. Print logs to terminal (Hidden in production, visible in dev)
            tauri::async_runtime::spawn(async move {
                while let Some(event) = rx.recv().await {
                    if let tauri_plugin_shell::process::CommandEvent::Stdout(line_bytes) = event {
                        println!("NODE: {}", String::from_utf8_lossy(&line_bytes));
                    } else if let tauri_plugin_shell::process::CommandEvent::Stderr(line_bytes) =
                        event
                    {
                        println!("NODE ERR: {}", String::from_utf8_lossy(&line_bytes));
                    }
                }
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
