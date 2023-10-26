const {app, BrowserWindow, dialog, Menu, ipcMain} = require('electron')
const path = require('path')
const {version} = require('../../package.json');
const Store = require('electron-store');

const store = new Store();

ipcMain.on('electron-store-get-data', (event, arg) => {
    if (arg && typeof arg.key !== 'undefined') {
        event.returnValue = store.get(arg.key, arg.defaultValue);
    } else {
        event.returnValue = null;
    }
});

let mainWindow
let tocMenu = []

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 900,
        icon: "images/book.png",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    mainWindow.loadFile('src/html/index.html')
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

const generateMenu = () => {
    return [
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
                                mainWindow.webContents.send('file-opened', path.resolve(file.filePaths[0]))
                            }
                        }).catch(err => {
                            console.log(err)
                        })
                    }
                },
                {
                    label: 'Table of Contents',
                    submenu: tocMenu
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
        },
        {
            label: 'View',
            submenu: [
                {
                    label: '🔆 Dark Mode',
                    click: function () {
                        mainWindow.webContents.send('toggle-dark-mode');
                    }
                }
            ]
        },
        {
            label: 'About',
            submenu: [
                {
                    label: 'About',
                    click: function () {
                        let aboutWindow = new BrowserWindow({
                            width: 500,
                            height: 500,
                            icon: "src/images/book-icon.png",
                            webPreferences: {
                                nodeIntegration: true,
                                contextIsolation: false
                            }
                        })
                        aboutWindow.loadFile('src/html/about.html').then(() => {
                            aboutWindow.webContents.send('app_version', version);
                        })
                    }
                }
            ]
        }
    ]
};

Menu.setApplicationMenu(Menu.buildFromTemplate(generateMenu()));

ipcMain.on('toc-ready', (event, toc) => {
    tocMenu = toc.map(tocItem => {
        return {
            label: tocItem.label,
            click: () => {
                mainWindow.webContents.send('toc-item-click', tocItem.href);
            }
        };
    });

    const menu = Menu.buildFromTemplate(generateMenu());
    Menu.setApplicationMenu(menu);
});
ipcMain.on('open-file-dialog', (event) => {
    dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [
            {name: 'ePub Files', extensions: ['epub']}
        ]
    }).then(result => {
        if (!result.canceled && result.filePaths.length > 0) {
            // Handle the selected file, e.g., send it to the renderer process
            event.sender.send('file-opened', result.filePaths[0]);
        }
    });
});
