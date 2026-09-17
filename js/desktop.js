window.initializeDesktopControls = function initializeDesktopControls() {
  const controls = document.querySelector('.window-controls');
  const minimizeButton = document.getElementById('btn-minimize');
  const closeButton = document.getElementById('btn-close');
  const desktopAPI = window.desktopAPI;

  if (!desktopAPI) {
    if (controls) controls.style.display = 'none';
    return;
  }

  minimizeButton?.addEventListener('click', desktopAPI.minimize);
  closeButton?.addEventListener('click', desktopAPI.close);
};
