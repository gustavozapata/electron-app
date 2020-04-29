const { app, BrowserWindow, Menu } = require("electron");
const shell = require("electron").shell;
const ipc = require("electron").ipcMain;
//interprocess communications = allows communication (passing data) between processes (i.e. windows)
//there are two ipc's = ipcMain and ipcRenderer

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  win.loadFile("src/index.html");

  // Open the DevTools. - similar to Chrome's DevTools
  // win.webContents.openDevTools();

  const menu = Menu.buildFromTemplate([
    {
      label: "Menu",
      submenu: [
        { label: "Adjust Notification Value" },
        {
          label: "CoinMarketCap",
          click() {
            shell.openExternal("http://coinmarketcap.com");
          },
        },
        { type: "separator" },
        {
          label: "Exit",
          click() {
            app.quit();
          },
        },
      ],
    },
    {
      label: "Info",
    },
  ]);

  Menu.setApplicationMenu(menu);

  ipc.on("update-notify-value", function (event, arg) {
    //arg is the value we are sending
    win.webContents.send("targetPriceVal", arg);
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
