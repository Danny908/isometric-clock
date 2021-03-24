const { app, BrowserWindow, Menu, ipcRenderer, ipcMain } = require('electron');
const template = (win) => [
  {
    label: 'Isometric Clock',
    submenu: [
      {
        label: '24-Hour Time Format',
        type: 'checkbox',
        click: (menu) => {
          const { checked } = menu;
          const channel = '24TimeFormat';
          // Send checked status to renderer...
          win.webContents.send(channel, checked);
        },
      },
    ],
  },
];

function createWindow() {
  const win = new BrowserWindow({
    width: 450,
    height: 330,
    transparent: true,
    frame: false,
    webPreferences: {
      preload: `${__dirname}/preload.js`,
      nodeIntegration: false,
      enableRemoteModule: false,
    },
  });
  win.setResizable(false);
  // win.webContents.openDevTools();
  win.loadFile('index.html');
  createMenus(win);
}

function createMenus(win) {
  const menu = Menu.buildFromTemplate(template(win));
  Menu.setApplicationMenu(menu);
}

app.on('ready', () => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
