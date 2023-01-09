const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  // 能暴露的不仅仅是函数，我们还可以暴露变量
  ping: () => ipcRenderer.invoke('ping'),
})

contextBridge.exposeInMainWorld('electronAPI',{
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
    getFileData: (filePath) => ipcRenderer.invoke('getfiledata', filePath),
    getUrlData: (url) => ipcRenderer.invoke('geturldata', url),
    saveData: (data) => ipcRenderer.invoke('savedata', data),
})

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
  
    for (const type of ['chrome', 'node', 'electron']) {
      replaceText(`${type}-version`, process.versions[type])
    }
  })