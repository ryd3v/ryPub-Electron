const {ipcRenderer} = require('electron')
const ePub = require("epubjs").default
const Store = require('electron-store');
const store = new Store();

let rendition;

ipcRenderer.on('file-opened',
    (event, data) => {
        const book = ePub(data.path);
        //console.log("Received file-opened event for:", data.path);

        rendition = book.renderTo("viewer", {width: "100%", height: "100%"});
        book.ready.then(() => {
            const {toc} = book.navigation;
            ipcRenderer.send('toc-ready', toc);
            const lastLocation = store.get(data.title);
            if (lastLocation) {
                rendition.display(lastLocation);
            } else {
                rendition.display();
            }

        });

        rendition.themes.default({
            'body': {
                'font-family': 'Roboto, sans-serif'
            },
            'pre, code': {
                'font-family': 'JetBrains Mono, sans-serif'
            }
        });

        rendition.on('relocated', (location) => {
            store.set(data.title, location.start.cfi);
        });
    })

ipcRenderer.on('file-closed', () => {
    if (rendition) {
        rendition.destroy();
        rendition = null;
    }
    document.getElementById('viewer').innerHTML = '';
});

ipcRenderer.on('app_version', (event, appVersion) => {
    document.getElementById('app-version').innerText = `App version: ${appVersion}`;
});

ipcRenderer.on('toc-item-click', (event, href) => {
    rendition.display(href);
});

ipcRenderer.on('toggle-dark-mode', () => {
    const currentClass = document.documentElement.className;
    if (currentClass === 'dark') {
        document.documentElement.className = '';
        if (rendition) {
            rendition.themes.default({
                'body': {
                    'font-family': 'Roboto, sans-serif',
                    'background-color': 'white',
                    'color': 'black'
                },
                'pre, code': {
                    'font-family': 'JetBrains Mono, sans-serif',
                    'white-space': 'pre-wrap',
                    'word-wrap': 'break-word'
                }
            });
        }
    } else {
        document.documentElement.className = 'dark';
        if (rendition) {
            rendition.themes.default({
                'body': {
                    'font-family': 'Roboto, sans-serif',
                    'background-color': '#18181b',
                    'color': '#e4e4e7'
                },
                'pre, code': {
                    'font-family': 'JetBrains Mono, sans-serif',
                    'white-space': 'pre-wrap',
                    'word-wrap': 'break-word'
                }
            });
        }
    }
});

document.getElementById('next').addEventListener('click', () => {
    rendition.next();
});

document.getElementById('prev').addEventListener('click', () => {
    rendition.prev();
});

document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") {
        rendition.next();
    } else if (e.key === "ArrowLeft") {
        rendition.prev();
    }
});
