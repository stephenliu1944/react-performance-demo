import path from 'path';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const STATIC_PATH = 'static';
const extractStyle = new ExtractTextPlugin(`${STATIC_PATH}/css/[contenthash].style.css`);

export default {
    entry: {
        main: ['./src/index.jsx'],
        vendor: ['react', 'react-dom']
    },
    output: {
        publicPath: '/',
        path: path.join(__dirname, 'build'),
        filename: `${STATIC_PATH}/js/[chunkhash].[name].js`
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css']
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            include: path.join(__dirname, 'src'),
            use: ['babel-loader']
        /**
         * 主项目的css合并到style.css
         */
        }, {
            test: /\.css$/,
            include: path.join(__dirname, 'src'),
            use: extractStyle.extract([
                {
                    loader: 'css-loader',
                    options: {
                        modules: true,
                        importLoaders: 1,
                        localIdentName: '[local]__[hash:base64:5]'
                    }
                },
                'postcss-loader'
            ])
        }]
    },
    plugins: [
        extractStyle,
        new CleanWebpackPlugin(['build']),                  // 清除编译目录
        new webpack.optimize.CommonsChunkPlugin('vendor'),  // 提取公共模块
        new HtmlWebpackPlugin({                             // 主页面入口index.html
            filename: 'index.html',
            template: './src/index.html'
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,                                 // 压缩loader读取的文件
            options: {
                postcss: function() {
                    return [autoprefixer];
                }
            }
        })
    ]
};
