const { ipcRenderer } = require('electron');
const ePub = require('epubjs').default;

let rendition;

function updateTheme(isDarkMode) {
  const linkColor = isDarkMode ? '#3b82f6' : '#3b82f6';
  const trColor = isDarkMode ? '#252525' : '#F5F5F5';
  const blockquoteBorderColor = isDarkMode ? '#454545' : '#DDDDDD';
  const blockquoteBackgroundColor = isDarkMode ? '#252525' : '#F9F9F9';
  rendition.themes.default({
    body: {
      'font-family': 'Roboto, sans-serif',
      'background-color': isDarkMode ? '#18181b' : 'white',
      color: isDarkMode ? '#e4e4e7' : 'black',
    },
    'pre, code': {
      'font-family': 'JetBrains Mono, sans-serif',
      'white-space': 'pre-wrap',
      'word-wrap': 'break-word',
    },
    'a, a:link, a:visited': {
      color: linkColor,
    },
    tr: {
      'background-color': trColor,
    },
    blockquote: {
      'border-left': `4px solid ${blockquoteBorderColor}`,
      'background-color': blockquoteBackgroundColor,
      padding: '10px 20px',
      margin: '20px 0',
    },
  });
}

ipcRenderer.on('file-opened', (event, file) => {
  document.getElementById('splash-screen').style.display = 'none';
  const book = ePub(file);
  rendition = book.renderTo('viewer', { width: '100%', height: '100%' });

  book.ready.then(() => {
    const { toc } = book.navigation;
    ipcRenderer.send('toc-ready', toc);
    const lastLocation = store.get('lastKnownLocation');
    if (lastLocation) {
      rendition.display(lastLocation);
    } else {
      rendition.display();
    }
  });

  // When the book is ready and rendered, update the theme
  rendition.on('rendered', () => {
    updateTheme(document.documentElement.className === 'dark');
  });

  rendition.on('relocated', (location) => {
    store.set('lastKnownLocation', location.start.cfi);
  });
});

ipcRenderer.on('file-closed', () => {
  if (rendition) {
    rendition.destroy();
    rendition = null;
  }
  document.getElementById('viewer').innerHTML = '';
});

ipcRenderer.on('app_version', (event, appVersion) => {
  document.getElementById(
    'app-version'
  ).innerText = `App version: ${appVersion}`;
});

ipcRenderer.on('toc-item-click', (event, href) => {
  rendition.display(href);
});

ipcRenderer.on('toggle-dark-mode', () => {
  const isDarkMode = document.documentElement.className !== 'dark';
  document.documentElement.className = isDarkMode ? 'dark' : '';
  updateTheme(isDarkMode);
});

document.getElementById('next').addEventListener('click', () => {
  rendition.next();
});

document.getElementById('prev').addEventListener('click', () => {
  rendition.prev();
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') {
    rendition.next();
  } else if (e.key === 'ArrowLeft') {
    rendition.prev();
  }
});

document.getElementById('open-file-button').addEventListener('click', () => {
  ipcRenderer.send('open-file-dialog');
});
