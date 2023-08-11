const {ipcRenderer} = require('electron');
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const xml2js = require('xml2js');

function extractBookCover(epubPath) {
    try {
        const zip = new AdmZip(epubPath);
        console.log("Extracting cover from:", epubPath);

        const container = zip.readAsText("META-INF/container.xml");
        let opfPath;
        xml2js.parseString(container, {tagNameProcessors: [xml2js.processors.stripPrefix]}, (err, result) => {
            if (err) {
                console.error("Failed to parse container.xml:", err);
                return;
            }
            opfPath = result.container.rootfiles[0].rootfile[0].$.fullPath;
        });

        if (!opfPath) {
            console.error("Could not find OPF path in container.xml");
            return './images/placeholder_image.png';
        }

        const opf = zip.readAsText(opfPath);
        let coverImagePath;
        xml2js.parseString(opf, (err, result) => {
            if (err) {
                console.error("Failed to parse OPF:", err);
                return;
            }

            const manifest = result.package.manifest[0].item;
            const coverItem = manifest.find(item => item.$["properties"] === "cover-image");
            if (coverItem) {
                coverImagePath = coverItem.$.href;
            }
        });

        if (!coverImagePath) {
            console.error("Could not find cover image path in OPF");
            return './images/placeholder_image.png';
        }

        const coverImageBuffer = zip.readFile(opfPath.replace(/[^\/]+$/, '') + coverImagePath);
        const coverImageSavePath = path.join(require('os').tmpdir(), 'epub-cover-' + Date.now() + '.png');
        fs.writeFileSync(coverImageSavePath, coverImageBuffer);

        return coverImageSavePath;
    } catch (error) {
        console.error("Error in extractBookCover:", error);
        return './images/placeholder_image.png';
    }
}

ipcRenderer.on('load-books', (event, directoryPath) => {
    console.log('Received load-books event with directory path:', directoryPath);
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        const epubFiles = files.filter(file => path.extname(file).toLowerCase() === '.epub');
        console.log('Found EPUB files:', epubFiles);
        epubFiles.forEach(epubFile => {
            const fullBookPath = path.join(directoryPath, epubFile);

            const bookElement = document.createElement('div');
            bookElement.classList.add('book-item');

            const bookImage = document.createElement('img');
            bookImage.src = extractBookCover(fullBookPath);
            bookElement.appendChild(bookImage);

            const bookTitle = document.createElement('span');
            bookTitle.textContent = path.basename(epubFile, '.epub');
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
