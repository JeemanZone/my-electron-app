const { app, BrowserWindow, ipcMain, dialog} = require('electron')
const path = require('path')
const fs = require('node:fs/promises')

async function handleFileOpen() {
    let dialogopts = {
      filters: [{
        name: "JSON",
        extensions: ["json"]
      }]
    }
    const { canceled, filePaths } = await dialog.showOpenDialog(dialogopts)
    if (canceled) {
      return
    } else {
      return filePaths[0]
    }
}

async function getFileData (event, filePath) {
    try {
        const contents = await fs.readFile(filePath);
        return JSON.parse(contents);
    } catch (err) {
        dialog.showErrorBox("Error", err.message)
    }
}

async function saveData (event, data) {
    try {
      let dialogopts = {
        filters: [{
          name: "JSON",
          extensions: ["json"]
        }]
      }
        const filePath = dialog.showSaveDialogSync(dialogopts);
        if (filePath === undefined) {
          return
        } else {
          console.dir(data);
          await fs.writeFile(filePath, JSON.stringify(data));
          let options = {
            title : "提示",
            message : "保存成功！"
          };
          dialog.showMessageBoxSync(options);
        }
    } catch (err) {
        dialog.showErrorBox("Error", err.message + "\n" + err.stack)
    }
}

async function getUrlData (event, url) {
  const fetch = require("node-fetch");
  try {
    const options = {
      method: 'GET',
    };
    const response = await fetch(url,options);
    let data = await response.json();
    return data;
  } catch (err) {
    dialog.showErrorBox("Error", err.message)
  }
}

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  ipcMain.handle('ping', () => 'pong')
  ipcMain.handle('dialog:openFile', handleFileOpen)
  ipcMain.handle('getfiledata', getFileData)
  ipcMain.handle('geturldata', getUrlData)
  ipcMain.handle('savedata', saveData)
  win.loadFile('app.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})