const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs');
const { stat } = require('node:original-fs');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,   // keep renderer isolated from Node
            nodeIntegration: false,
        },
    });
    win.loadFile('index.html');
}


// Example of backend-style logic exposed over IPC
ipcMain.handle('get-system-info', () => ({
    platform: os.platform(),
    cpus: os.cpus().length,
    totalMemGB: (os.totalmem() / 1e9).toFixed(1),
}));

ipcMain.handle('get-app-version', () => ({
    versions: process.versions
}))

ipcMain.handle('get-all-files', async () => {
  const entries = await fs.promises.readdir(__dirname, { withFileTypes: true });

  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(entry.parentPath, entry.name);
      try {
        const stats = await fs.promises.stat(fullPath);
        return {
          name: entry.name,
          path: fullPath,
          isDirectory: entry.isDirectory(),
          size: stats.size,
          modified: stats.mtimeMs,
        };
      } catch (err) {
        // locked or permission-denied files shouldn't kill the whole listing
        return { name: entry.name, path: fullPath, error: err.code };
      }
    })
  );

  return files;
});

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});