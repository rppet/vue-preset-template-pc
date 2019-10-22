const path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    publicPath: '/',
    // pages: {
    //     app: 'src/main.js'
    // },
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@common', resolve('src/common'))
            .set('@assets', resolve('src/assets'))
            .set('@components', resolve('src/components'))
            .set('@', resolve('src'));
    },
    configureWebpack: {
        externals: {
            // topbar: 'topbar.default'
        }
    },
    css: {
        loaderOptions: {
            less: {
                paths: [path.resolve(__dirname, 'src/assets/css')]
            }
        }
    },
    devServer: {
        overlay: {
            warnings: true,
            errors: true
        },
        proxy: {
            '/dmd': {
                target: process.env.PROXY_SERVER,
                changeOrigin: true,
                pathRewrite: {
                    // '^/dmd/': '/'
                }
            }
        }
    }
};
