const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  // getAppVersionInfo: () => ipcRenderer.invoke('get-app-version'),
  getFiles: () => ipcRenderer.invoke('get-all-files')
});