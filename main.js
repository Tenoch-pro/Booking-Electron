// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain, session } = require('electron')
const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  app.commandLine.appendSwitch('disable-site-isolation-trials')
  
  // Create the browser window.
  mainWindow = new BrowserWindow({
    titleBarStyle: 'hidden',
    width: 800,
    height: 600,
    show: false,  // don't show the main window
    frame: false, 
    backgroundColor: '#fff',
    resizable : false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  });


  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on("add-cookie", (event, data) => {
  console.log('add-cookie called', data)
  const cookie = {url: 'https://consolidatorapp.tts.com', name: ".ASPXAUTH", value: data["cookie_value"]}
  session.defaultSession.cookies.set(cookie, (error) => {
    if (error) console.error(error)
  })
})

ipcMain.on("delete-cookie", (event, data) => {
  console.log('delete-cookie called')
  session.defaultSession.cookies.get({}, (error, cookies) => {
    cookies.forEach((cookie) => {
      let url = '';
      // get prefix, like https://www.
      url += cookie.secure ? 'https://' : 'http://';
      url += cookie.domain.charAt(0) === '.' ? 'www' : '';
      // append domain and path
      url += cookie.domain;
      url += cookie.path;

      session.defaultSession.cookies.remove(url, cookie.name, (error) => {
        if (error) console.log(`error removing cookie ${cookie.name}`, error);
      });
    });
  });
})

ipcMain.on("main-view", () => {

  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['Origin'] = 'https://consolidatorapp.tts.com';
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

  let mainView = new BrowserWindow({
    titleBarStyle: 'hidden',
    width: 1920,
    height: 1048,
    show: false,  // don't show the main window
    backgroundColor: '#fff',
    resizable : false,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
    }
  })

  // and load the index.html of the app.
  mainView.loadFile('views/main.html')
  mainView.setMenuBarVisibility(false)

  mainView.once('ready-to-show', () => {
    mainWindow.hide()
    mainView.show()
  });

  mainView.on('closed', () => {
    app.quit()
  })
})