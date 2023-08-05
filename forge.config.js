module.exports = {
    packagerConfig: {
        asar: true,
        icon: "src/images/1024x1024"
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
                    icon: 'src/images/1024x1024.png'
                }
            },
        },
        {
            name: '@electron-forge/maker-rpm',
            config: {
                options: {
                    icon: 'src/images/1024x1024.png'
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
