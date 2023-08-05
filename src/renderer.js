const {ipcRenderer} = require('electron')
const ePub = require("epubjs").default

let rendition;

ipcRenderer.on('file-opened',
    (event, file) => {
        const book = ePub(file);
        rendition = book.renderTo("viewer", {width: "100%", height: "100%"});
        book.ready.then(() => {
            const {toc} = book.navigation;
            // console.log(toc);
            ipcRenderer.send('toc-ready', toc);
        });

        rendition.themes.default({
            'body': {
                'font-family': 'Roboto, sans-serif'
            },
            'pre, code': {
                'font-family': 'JetBrains Mono, sans-serif'
            }
        });
        rendition.display();
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
