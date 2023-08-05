const {app, BrowserWindow, dialog, Menu, ipcMain} = require('electron')
const path = require('path')
const {version} = require('../package.json');

let mainWindow
let tocMenu = []

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
    // mainWindow.webContents.openDevTools();
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

const menuTemplate = [
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
                label: 'TOC',
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
        label: 'About',
        submenu: [
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
            }
        ]
    }
]


Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate))

ipcMain.on('toc-ready', (event, toc) => {
    tocMenu = toc.map(tocItem => {
        return {
            label: tocItem.label,
            click: () => {
                mainWindow.webContents.send('toc-item-click', tocItem.href);
            }
        };
    });

    // console.log('TOC Menu before building:', tocMenu);
    const tocIndex = menuTemplate.findIndex(item => item.label === 'File');
    if (tocIndex > -1) {
        const tocSubmenuIndex = menuTemplate[tocIndex].submenu.findIndex(item => item.label === 'TOC');
        if (tocSubmenuIndex > -1) {
            menuTemplate[tocIndex].submenu[tocSubmenuIndex].submenu = tocMenu;
        }
    }

    // console.log('Updated menuTemplate:', JSON.stringify(menuTemplate, null, 2));
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
});
