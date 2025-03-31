import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [updateStatus, setUpdateStatus] = useState("");

  useEffect(() => {
    checkForUpdates();
  }, []);

  async function checkForUpdates() {
    try {
      const update = await check();
      if (update) {
        setUpdateStatus(`Found update ${update.version} from ${update.date}`);
        console.log(`found update ${update.version} from ${update.date} with notes ${update.body}`);
        let downloaded = 0;
        let contentLength = 0;

        await update.downloadAndInstall((event) => {
          switch (event.event) {
            case "Started":
              contentLength = event.data.contentLength;
              setUpdateStatus(`Starting download of ${event.data.contentLength} bytes`);
              console.log(`started downloading ${event.data.contentLength} bytes`);
              break;
            case "Progress":
              downloaded += event.data.chunkLength;
              setUpdateStatus(`Downloaded ${downloaded} from ${contentLength} bytes`);
              console.log(`downloaded ${downloaded} from ${contentLength}`);
              break;
            case "Finished":
              setUpdateStatus("Download finished, installing...");
              console.log("download finished");
              break;
          }
        });

        setUpdateStatus("Update installed, restarting...");
        console.log("update installed");
        await relaunch();
      }
    } catch (error) {
      console.error("Update error:", error);
      setUpdateStatus("Error checking for updates");
    }
  }

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
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
    </main>
  );
}

export default App;
