module.exports = {
    packagerConfig: {
        icon: 'images/book',
        asar: true,
    },
    rebuildConfig: {},
    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            config: {},
        },
        {
            name: '@electron-forge/maker-zip',
            platforms: ['darwin'],
        },
        {
            name: '@electron-forge/maker-deb',
            config: {
                options: {
                    icon: 'images/book.png',
                    category: "Office"
                }
            },
        },
        {
            name: '@electron-forge/maker-rpm',
            config: {
                options: {
                    icon: 'src/images/book.png',
                    category: "Office"
                },
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
