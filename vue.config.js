
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
module.exports = {
    configureWebpack: {
        plugins: [
            new MonacoWebpackPlugin()
        ]
    }
    
    // css: {
    //     loaderOptions: {
    //         postcss: {
    //             plugins: ['postcss-preset-env']
    //         }
    //     }
    // }
}