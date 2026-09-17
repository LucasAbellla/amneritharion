const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs/promises');
const { pathToFileURL } = require('url');

const isTrustedSender = (event) => {
  const senderUrl = event.senderFrame?.url;
  return typeof senderUrl === 'string' && senderUrl.startsWith('file://');
};

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    backgroundColor: '#050508',
    autoHideMenuBar: true,
    show: false,
    frame: false,
    icon: path.join(__dirname, 'build', 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });

  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  win.webContents.on('will-navigate', (event, navigationUrl) => {
    if (!navigationUrl.startsWith('file://')) event.preventDefault();
  });

  win.loadFile('index.html');

  win.once('ready-to-show', () => {
    win.show();
  });
}

ipcMain.on('minimize-window', (event) => {
  if (!isTrustedSender(event)) return;
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.minimize();
});

ipcMain.on('close-window', (event) => {
  if (!isTrustedSender(event)) return;
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.close();
});

ipcMain.handle('author-export-backup', async (event, jsonContent) => {
  if (!isTrustedSender(event) || typeof jsonContent !== 'string') return { canceled: true };
  const win = BrowserWindow.fromWebContents(event.sender);
  const date = new Date().toISOString().slice(0, 10);
  const result = await dialog.showSaveDialog(win, {
    title: 'Exportar backup do Amneritharion',
    defaultPath: `amneritharion-backup-${date}.json`,
    filters: [{ name: 'Backup JSON', extensions: ['json'] }]
  });
  if (result.canceled || !result.filePath) return { canceled: true };
  await fs.writeFile(result.filePath, jsonContent, 'utf8');
  return { canceled: false, filePath: result.filePath };
});

ipcMain.handle('author-import-backup', async (event) => {
  if (!isTrustedSender(event)) return { canceled: true };
  const win = BrowserWindow.fromWebContents(event.sender);
  const result = await dialog.showOpenDialog(win, {
    title: 'Importar backup do Amneritharion',
    properties: ['openFile'],
    filters: [{ name: 'Backup JSON', extensions: ['json'] }]
  });
  if (result.canceled || !result.filePaths[0]) return { canceled: true };
  const content = await fs.readFile(result.filePaths[0], 'utf8');
  return { canceled: false, content };
});

ipcMain.handle('atlas-select-map-image', async (event) => {
  if (!isTrustedSender(event)) return { canceled: true };
  const win = BrowserWindow.fromWebContents(event.sender);
  const result = await dialog.showOpenDialog(win, {
    title: 'Selecionar imagem-base do mapa de Gionyyl',
    properties: ['openFile'],
    filters: [{ name: 'Imagens do mapa', extensions: ['png', 'jpg', 'jpeg', 'webp'] }]
  });
  if (result.canceled || !result.filePaths[0]) return { canceled: true };
  const sourcePath = result.filePaths[0];
  const extension = path.extname(sourcePath).toLowerCase();
  const atlasDirectory = path.join(app.getPath('userData'), 'atlas');
  const destination = path.join(atlasDirectory, `gionyyl-map${extension}`);
  await fs.mkdir(atlasDirectory, { recursive: true });
  await fs.copyFile(sourcePath, destination);
  return {
    canceled: false,
    url: pathToFileURL(destination).href,
    name: path.basename(sourcePath)
  };
});

ipcMain.handle('gallery-select-asset', async (event) => {
  if (!isTrustedSender(event)) return { canceled: true };
  const win = BrowserWindow.fromWebContents(event.sender);
  const result = await dialog.showOpenDialog(win, {
    title: 'Adicionar imagem ou documento à galeria',
    properties: ['openFile'],
    filters: [
      { name: 'Imagens e documentos', extensions: ['png', 'jpg', 'jpeg', 'webp', 'gif', 'pdf', 'txt', 'md', 'docx'] },
      { name: 'Todos os arquivos', extensions: ['*'] }
    ]
  });
  if (result.canceled || !result.filePaths[0]) return { canceled: true };
  const sourcePath = result.filePaths[0];
  const extension = path.extname(sourcePath).toLowerCase();
  const galleryDirectory = path.join(app.getPath('userData'), 'gallery');
  const safeName = `${Date.now()}-${path.basename(sourcePath).replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const destination = path.join(galleryDirectory, safeName);
  await fs.mkdir(galleryDirectory, { recursive: true });
  await fs.copyFile(sourcePath, destination);
  const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);
  return { canceled: false, url: pathToFileURL(destination).href, path: destination, name: path.basename(sourcePath), kind: imageExtensions.has(extension) ? 'image' : 'document', extension };
});

ipcMain.handle('gallery-open-document', async (event, documentPath) => {
  if (!isTrustedSender(event) || typeof documentPath !== 'string') return { opened: false };
  const galleryDirectory = path.resolve(app.getPath('userData'), 'gallery');
  const resolvedPath = path.resolve(documentPath);
  if (!resolvedPath.startsWith(`${galleryDirectory}${path.sep}`)) return { opened: false };
  const error = await shell.openPath(resolvedPath);
  return { opened: !error, error };
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
