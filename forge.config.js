module.exports = {
    packagerConfig: {
        asar: true,
        icon: "src/images/book-icon"
    },
    rebuildConfig: {},
    makers: [
        {
            name: '@electron-forge/maker-deb',
            config: {
                options: {
                    icon: 'src/images/book-icon.png'
                }
            },
        },
        {
            name: '@electron-forge/maker-rpm',
            config: {
                options: {
                    icon: 'src/images/book-icon.png'
                }
            },
        },
    ],
    plugins: [
        {
            name: '@electron-forge/plugin-auto-unpack-natives',
            config: {},
        },
    ],
};
