const {app, BrowserWindow, clipboard, ipcMain} = require('electron')
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
  	width: 800, 
  	height: 600,
    icon: __dirname + '/icon.png',
    show: false,
    webPreferences: {
      // Load `electron-notification-shim` in rendering view.
      preload: path.join(__dirname, 'browser.js')
    }
  })

  // Listen for notification events.
  ipcMain.on('notification-shim', (e, msg) => {
      console.log(`Title: ${msg.title}, Body: ${msg.options.body}`);
      win.flashFrame(true);
  });

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: 'www.curse.com', //path.join(__dirname, 'index.html'),
    protocol: 'https:',
    slashes: true,

  }))

  win.webContents.on('did-finish-load', () => {
    //win.flashFrame(true);
    //win.webContents.executeJavaScript('new Notification("Hello!", {body: "Notification world!"})');
  });

  // Open the DevTools.
  //win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

  win.minimize();

  win.once('focus', () => win.flashFrame(false))
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()

  }
})
