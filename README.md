# ryPub: A Simple EPUB Reader

ryPub is a simple yet powerful EPUB reader built with Electron and epub.js. It provides a straightforward way to read
your favorite EPUB books right on your desktop.

![ALT](https://github.com/ryd3v/ryPub-Electron/blob/main/Screenshot%20from%202023-08-03%2017-28-52.png)

## Features

- Open and read EPUB files from your local system
- Responsive design
- Navigation with both on-screen and keyboard controls (ArrowRight and ArrowLeft keys)
- Dynamic Table of Contents (TOC): The TOC of each EPUB file is now integrated into the application menu. Selecting a
  TOC item will navigate to the corresponding section in the EPUB file.
- Fonts: Application uses local Google Fonts - Roboto for general text and JetBrains Mono for preformatted text
- About Window: Provides information about the current version of the application

## Installation

To install rypub, you can download the latest release for your operating system from
the [Releases](https://github.com/ryd3v/ryPub-Electron/releases) page.

If you want to run the application from source, follow these steps:

1. Clone the repository:

```
git clone https://github.com/ryd3v/ryPub-Electron.git
cd rypub
```

2. Install the dependencies:

```
npm install
```

3. Start the application:

```
npm start
```

## Usage

After launching ryPub, you can open an EPUB file via the `File > Open` menu. Once a book is opened, you can navigate
through the book using the left and right arrow keys, or by using the next and previous buttons on the screen.

## Building

To build the application for your current platform, you can run:

```
npm run dist
```

This will create a distributable package in the `dist` directory.

## Contributing

We welcome contributions to ryRub! If you have a bug fix, feature request, or other enhancement, feel free to open a
pull request.
