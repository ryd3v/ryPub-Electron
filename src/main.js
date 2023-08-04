const {app, BrowserWindow, dialog, Menu} = require('electron')
const path = require('path')
const {version} = require('../package.json');

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 900,
        icon: path.join(__dirname, 'assets/icons/win/1024x1024.ico'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    mainWindow.loadFile('src/index.html')
        .then(() => console.log('File loaded successfully'))
        .catch(error => console.error(`Failed to load file: ${error}`));
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

const menu = Menu.buildFromTemplate([
    {
        label: 'File',
        submenu: [
            {
                label: 'Open',
                click: function () {
                    dialog.showOpenDialog(mainWindow, {
                        properties: ['openFile'],
                        filters: [{name: 'EPUB', extensions: ['epub']}]
                    }).then(file => {
                        if (!file.canceled) {
                            // handle the file content
                            mainWindow.webContents.send('file-opened', path.resolve(file.filePaths[0]))
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                }
            },
            {
                label: 'About',
                click: function () {
                    let aboutWindow = new BrowserWindow({
                        width: 400,
                        height: 400,
                        webPreferences: {
                            nodeIntegration: true,
                            contextIsolation: false
                        }
                    })
                    aboutWindow.loadFile('src/about.html').then(() => {
                        aboutWindow.webContents.send('app_version', version);
                    })
                }
            },
            {
                label: 'Close',
                click: () => {
                    mainWindow.webContents.send('file-closed')
                }
            },
            {type: 'separator'},
            {
                label: 'Exit',
                click: function () {
                    app.quit()
                }
            }
        ]
    }
])

Menu.setApplicationMenu(menu)
