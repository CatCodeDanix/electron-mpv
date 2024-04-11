import { app, BrowserWindow } from "electron";
import path from "path";
import fs from "fs-extra";
import usb from "usb";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = async () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  await init();

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

const url = "https://api.marypetpansion.ir/mpp-config";

interface ServerConfig {
  gDriveFolderNum: number;
}

let remoteConfigPath: string;

try {
  remoteConfigPath = path.join(__dirname, "config.json");
} catch (error) {
  console.log(error);
}

// const remoteConfigPath =

const getConfigFromServer = async () => {
  function saveConfigLocally(data: string) {
    fs.writeFile(remoteConfigPath, data, (err) => {
      if (err) {
        console.error(`Error saving config file locally: ${err.message}`);
      } else {
        console.log(`Config file saved locally at ${remoteConfigPath}`);
      }
    });
  }

  function readLocalConfig(
    callback: (err: string | null, config: ServerConfig | null) => void
  ) {
    fs.readFile(remoteConfigPath, (err, data) => {
      if (err) {
        console.error(`Error reading local config file: ${err.message}`);
        callback(err.message, null);
      } else {
        callback(null, JSON.parse(data as unknown as string));
      }
    });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const config = (await response.json()) as ServerConfig;
    saveConfigLocally(JSON.stringify(config));
    return config;
  } catch (error) {
    console.error(`Error connecting to API: ${(error as Error).message}`);
    readLocalConfig((err, config) => {
      if (err) {
        console.error(`No local config found: ${err}`);
      } else {
        console.log(`Using local config file: ${remoteConfigPath}`);
        return config;
      }
    });
  }
};

async function init() {
  const serverConfig = await getConfigFromServer();

  const { gDriveFolderNum } = serverConfig!;

  // let processing = false;

  console.log(gDriveFolderNum);

  const qwe = usb.getDeviceList();
  console.log(qwe);
}
