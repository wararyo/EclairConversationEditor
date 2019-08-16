import { app, BrowserWindow, Menu, ipcMain } from 'electron'
import openAboutWindow from 'about-window';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

var mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

// 二重起動防止

var isFirstInstance = app.requestSingleInstanceLock()
if(!isFirstInstance) app.quit();
app.on('second-instance', (event, argv, cwd) => {
  if (mainWindow === null) return;
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.focus();
  argv.forEach((item) => {
    if(item.match(/\.(eclairconversation|json)$/)) mainWindow.webContents.send("Load",item);
  });
});

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 560,
    useContentSize: true,
    width: 680,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

var viewerWindow;
const viewerWinURL = process.env.NODE_ENV === 'development'
? `http://localhost:9080/#/viewer/`
: `file://${__dirname}/index.html#viewer`

function createViewerWindow() {
  viewerWindow = new BrowserWindow({
    height: 360,
    useContentSize: true,
    width: 640,
    webPreferences: {
      nodeIntegration: true
    }
  })
  viewerWindow.loadURL(viewerWinURL)
  viewerWindow.setTitle("Preview");
  viewerWindow.on('closed', () => {
    viewerWindow = null
  });
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

app.on('open-file', (event,path) => {
  event.preventDefault();
  if(mainWindow === void 0) process.openFile = path;
  else mainWindow.webContents.send("Load",path);
});

ipcMain.on('Preview', (event,conversation,index) => {
  if(!viewerWindow) {
    createViewerWindow();
    ipcMain.once('viewer-ready', () => viewerWindow.webContents.send("Play", conversation, 3));
  }
  else viewerWindow.webContents.send("Play", conversation, 3);
});

app.on('ready', function() {

  process.currentVersion = app.getVersion();

  //メニューの中身、ショートカットを設定
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
        },
        {
          type: 'separator'
        },
        {
          label: 'Copy as Text',
          accelerator: 'CmdOrCtrl+T',
          click: function(item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.webContents.send("CopyAsText");
          }
        },
        {
          label: 'Copy as Text from Folder',
          accelerator: 'CmdOrCtrl+Shift+T',
          click: function(item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.webContents.send("CopyAsTextFromFolder");
          }
        },
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
        /*{
          type: 'separator'
        },*/
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
          label: 'Start Preview',
          accelerator: 'F8',
          click: function(item, focusedWindow) {
            if(mainWindow) mainWindow.webContents.send("Preview");
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

  //メニューを追加
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
