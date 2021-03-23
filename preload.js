const { ipcRenderer, contextBridge } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});

// Send ipcRenderer to script app without exposing whole node modules...
contextBridge.exposeInMainWorld('api', {
  receive: (channel, callback) => {
    // Whitelist channel...
    const validChannel = '24TimeFormat';
    if (validChannel === channel) {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  },
});
