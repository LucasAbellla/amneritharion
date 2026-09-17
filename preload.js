const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopAPI', {
  minimize: () => ipcRenderer.send('minimize-window'),
  close: () => ipcRenderer.send('close-window'),
  exportBackup: (jsonContent) => ipcRenderer.invoke('author-export-backup', jsonContent),
  importBackup: () => ipcRenderer.invoke('author-import-backup'),
  selectAtlasImage: () => ipcRenderer.invoke('atlas-select-map-image'),
  selectGalleryAsset: () => ipcRenderer.invoke('gallery-select-asset'),
  openGalleryDocument: (documentPath) => ipcRenderer.invoke('gallery-open-document', documentPath)
});
