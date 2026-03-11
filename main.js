const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  // Configurações da Janela do Grimório
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    backgroundColor: '#050508', 
    autoHideMenuBar: true, // Esconde o menu clássico
    show: false,
    
    // Sugestão 1: Ativa a Janela Fantasma (frameless)
    frame: false, 
    icon: path.join(__dirname, 'icon.jpg'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false // Necessário para CSS 'app-region' em algumas versões
    }
  });

  // Carrega o seu HTML principal
  win.loadFile('index.html');

  // Só mostra a janela quando ela estiver totalmente renderizada (efeito mais polido)
  win.once('ready-to-show', () => {
    win.show();
  });
}

// Quando o sistema estiver pronto, abre a janela
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Fecha o aplicativo quando todas as janelas forem fechadas
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});