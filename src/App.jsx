import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [updateStatus, setUpdateStatus] = useState(""); // Estado para mensajes de actualización
  const [errorMessage, setErrorMessage] = useState(""); // Estado específico para errores

  useEffect(() => {
    checkForUpdates();
  }, []);

  async function checkForUpdates() {
    setUpdateStatus("Checking for updates...");
    setErrorMessage(""); // Limpiar errores previos

    try {
      const update = await check();
      console.log("Update check response:", update);

      if (update) {
        setUpdateStatus(`Found update ${update.version} from ${update.date}`);
        console.log(`Found update ${update.version} from ${update.date} with notes ${update.body}`);
        let downloaded = 0;
        let contentLength = 0;

        await update.downloadAndInstall((event) => {
          switch (event.event) {
            case "Started":
              contentLength = event.data.contentLength || "unknown";
              setUpdateStatus(`Starting download of ${contentLength} bytes`);
              console.log(`Started downloading ${contentLength} bytes`);
              break;
            case "Progress":
              downloaded += event.data.chunkLength;
              setUpdateStatus(`Downloaded ${downloaded} of ${contentLength} bytes`);
              console.log(`Downloaded ${downloaded} from ${contentLength}`);
              break;
            case "Finished":
              setUpdateStatus("Download finished, installing...");
              console.log("Download finished");
              break;
            default:
              setErrorMessage(`Unknown event during update: ${event.event}`);
              console.error("Unknown event:", event);
          }
        });

        setUpdateStatus("Update installed, restarting...");
        console.log("Update installed");
        await relaunch();
      } else {
        setUpdateStatus("No updates available");
        console.log("No update available");
      }
    } catch (error) {
      console.error("Update process failed:", error);
      const errorDetails = error.message || JSON.stringify(error) || "Unknown error occurred";
      setErrorMessage(`Update failed: ${errorDetails}`);
      setUpdateStatus(""); // Limpiar el estado de actualización si hay error
    }
  }

  async function greet() {
    try {
      setGreetMsg(await invoke("greet", { name }));
    } catch (error) {
      setErrorMessage(`Greet failed: ${error.message || "Unknown error"}`);
    }
  }

  return (
    <main className="container">
      <h1>Welcome to Tauri + React</h1>

      <div className="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input id="greet-input" onChange={(e) => setName(e.currentTarget.value)} placeholder="Enter a name..." />
        <button type="submit">Greet</button>
      </form>
      <p>{greetMsg}</p>

      {updateStatus && (
        <div className="update-status">
          <p>{updateStatus}</p>
        </div>
      )}

      {errorMessage && (
        <div className="error-message" style={{ color: "red", marginTop: "10px" }}>
          <p>
            <strong>Error:</strong> {errorMessage}
          </p>
        </div>
      )}
    </main>
  );
}

export default App;
