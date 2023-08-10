const {ipcRenderer} = require('electron');
const fs = require('fs');
const path = require('path');


ipcRenderer.on('load-books', (event, directoryPath) => {
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        const epubFiles = files.filter(file => path.extname(file).toLowerCase() === '.epub');

        epubFiles.forEach(epubFile => {
            const fullBookPath = path.join(directoryPath, epubFile);

            const bookElement = document.createElement('div');
            bookElement.classList.add('book-item');

            const bookImage = document.createElement('img');
            bookImage.src = './images/placeholder_image.png';  // Placeholder image
            bookElement.appendChild(bookImage);

            const bookTitle = document.createElement('span');
            bookTitle.textContent = path.basename(epubFile, '.epub'); // Use filename as title
            bookElement.appendChild(bookTitle);

            bookElement.addEventListener('click', () => {
                ipcRenderer.send('open-book', {
                    path: fullBookPath,
                    title: path.basename(epubFile, '.epub')
                });
                ipcRenderer.send('close-books-window');
            });

            document.getElementById('booksGrid').appendChild(bookElement);
        });
    });
});
