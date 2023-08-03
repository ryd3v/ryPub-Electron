const {ipcRenderer} = require('electron')
const ePub = require("epubjs").default

let rendition;

ipcRenderer.on('file-opened', (event, file) => {
    const book = ePub(file);
    rendition = book.renderTo("viewer", {width: "100%", height: "100%"});
    rendition.themes.default({
        '::selection': {
            'background': 'rgba(255,255,255, 0.3)'
        },
        '::-moz-selection': {
            'background': 'rgba(255,255,255, 0.3)'
        },
        'body': {
            'font-family': 'Roboto, sans-serif'
        }
    });
    const displayed = rendition.display();
})

ipcRenderer.on('file-closed', () => {
    if (rendition) {
        rendition.destroy();
        rendition = null;
    }
    document.getElementById('viewer').innerHTML = '';
});

// Event listener for "Next" button
document.getElementById('next').addEventListener('click', () => {
    rendition.next();
});

// Event listener for "Previous" button
document.getElementById('prev').addEventListener('click', () => {
    rendition.prev();
});

// Keydown event for ArrowRight and ArrowLeft keys
document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") {
        rendition.next();
    } else if (e.key === "ArrowLeft") {
        rendition.prev();
    }
});
