const {app, BrowserWindow, dialog, Menu} = require('electron')
const fs = require('fs')
const path = require('path')

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    })

    mainWindow.loadFile('index.html')
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
