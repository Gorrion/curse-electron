const {app, BrowserWindow, clipboard, ipcMain, nativeImage} = require('electron')
const path = require('path')
const url = require('url')
const notifier = require('node-notifier');
const fs = require('fs');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
//let win
function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 1000,
        height: 700,
        icon: __dirname + '/icon.png',
        show: false,
        webPreferences: {
            // Load `electron-notification-shim` in rendering view.
            preload: path.join(__dirname, 'browser.js')
        }
    });

    /*ipcMain.on('asynchronous-message', (event, arg) => {
     console.log(arg)  // prints "ping"
     event.sender.send('asynchronous-reply', 'pong')
     })*/

    // Listen for notification events.
    ipcMain.on('notification-shim', (e, msg) => {
        console.log(`Title: ${msg.title}, Body: ${msg.options.body}`);
        //msg.onclick = () => { console.log('Notification clicked') }

        //win.flashFrame(true);
        setBadge();
    });

    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: 'app.twitch.tv/home', //path.join(__dirname, 'index.html'),
        protocol: 'https:',
        slashes: true,
    }));

    win.webContents.on('did-finish-load', () => {
        //var canvas = document.createElement("canvas");
        //win.flashFrame(true);
        //win.webContents.executeJavaScript('new Notification("Hello!", {body: "Notification world!"})');

        setBadge();
    });

    // Open the DevTools.
    //win.webContents.openDevTools();

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    });

    win.minimize();

    win.on('focus', () => {
        win.flashFrame(false);
        // setBadge(10);
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});


let setBadge = function (text) {
    win.webContents.send('set-window-icon');

    return;
};
