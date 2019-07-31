import { app, BrowserWindow, Menu } from 'electron'
import openAboutWindow from 'about-window';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/* Menu */
app.on('ready', function() {

  // 【新規追加】メニューの中身、ショートカットを設定
  var template = [
    {
      label: 'Eclair Conversation Editor',
      submenu: [
        {
          label: 'About Eclair Conversation Editor',
          click: function(item, focusedWindow) {
            openAboutWindow({
              icon_path: '../../dist/electron/static/Conversation-xlarge.png',
              homepage: 'https://github.com/wararyo/EclairConversationEditor',
              copyright: 'Copyright (c) 2019 wararyo'
            });
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Preferences',
          click: function(item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.webContents.send("PreferenceRequired");
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'CmdOrCtrl+Q' : 'Alt+F4',
          role: 'quit'
        }
      ]
    },
    {
      label: 'File',
      submenu: [
        {
          label: 'New',
          accelerator: 'CmdOrCtrl+N',
          click: function(item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.webContents.send("New");
          }
        },
        {
          label: 'Open',
          accelerator: 'CmdOrCtrl+O',
          click: function(item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.webContents.send("Open");
          }
        },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: function(item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.webContents.send("Save");
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo'
        },
        {
          label: 'Redo',
          accelerator: 'Shift+CmdOrCtrl+Z',
          role: 'redo'
        },
        {
          type: 'separator'
        },
        {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut'
        },
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy'
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste'
        },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          role: 'selectall'
        },
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Collapse All',
          accelerator: 'CmdOrCtrl+Shift+E',
          click: function(item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.webContents.send("CollapseAll");
          }
        },
        {
          label: 'Expand All',
          accelerator: 'CmdOrCtrl+E',
          click: function(item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.webContents.send("ExpandAll");
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: function(item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.reload();
          }
        },
        {
          label: 'Toggle Full Screen',
          accelerator: (function() {
            if (process.platform == 'darwin')
              return 'Ctrl+Command+F';
            else
              return 'F11';
          })(),
          click: function(item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: (function() {
            if (process.platform == 'darwin')
              return 'Alt+Command+I';
            else
              return 'F12';
          })(),
          click: function(item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.webContents.toggleDevTools();
          }
        },
      ]
    },
    {
      label: 'Window',
      role: 'window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize'
        },
        {
          label: 'Close',
          accelerator: 'CmdOrCtrl+W',
          role: 'close'
        },
      ]
    },
    {
      label: 'Help',
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: function() { require('electron').shell.openExternal('https://github.com/wararyo/EclairConversationEditor') }
        },
      ]
    },
  ];

  // 【新規追加】メニュー機能を追加
  var menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
