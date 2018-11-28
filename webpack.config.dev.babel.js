import path from 'path';
import webpack from 'webpack';
import webpackMerge from 'webpack-merge';
import baseConfig from './webpack.config.base';

const env = process.env;
const PORT = env.npm_package_devServer_port;
const SOCKET_PORT = env.npm_package_webSocket_port;

export default webpackMerge(baseConfig, {
    devtool: 'cheap-module-eval-source-map',
    module: {
        rules: [{
        /**
         * eslint代码规范校验
         */
            test: /\.(js|jsx)$/,
            enforce: 'pre',
            include: path.join(__dirname, 'src'),
            use: [{
                loader: 'eslint-loader',
                options: {
                    configFile: '.eslintrc.json'
                }
            }]
        }]
    },
    plugins: [
        // 出错不终止插件
        new webpack.NoEmitOnErrorsPlugin(),
        // 配置全局变量
        new webpack.DefinePlugin({
            __DEV__: true,
            __SOCKET_PORT__: SOCKET_PORT
        })
    ],
    devServer: {
        host: '0.0.0.0',
        port: PORT,
        disableHostCheck: true,
        compress: true,             // 开起 gzip 压缩
        inline: true,
        historyApiFallback: true,   // browserHistory路由
        contentBase: path.join(__dirname, 'build')
    }
});
