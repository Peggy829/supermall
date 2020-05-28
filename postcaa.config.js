module.exports = {
    plugins: {
        autoprefixer: {},
        "postcss-px-viewport": {
            viewportWidth: 375,
            viewportHeight: 667,
            unitPrecision: 5,
            viewportUnit: 'vw',
            selectorBlackList: ['ignore', 'tab-bar', 'tar-bar-item'],
            minPixelValue: 1,
            mediaQuery: false
        }
    }
}