const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow () {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    icon: path.join(__dirname, 'img/icon.ico'), // Ícone atualizado
    backgroundColor: '#050508', 
    autoHideMenuBar: true, 
    show: false,
    frame: false, 
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false 
    }
  });

  win.loadFile('index.html');

  win.once('ready-to-show', () => {
    win.show();
  });

  // Ouve os comandos de fechar e minimizar vindos do HTML
  ipcMain.on('minimize-window', () => { win.minimize(); });
  ipcMain.on('close-window', () => { win.close(); });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});