const path = require('path');

const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: path.join(__dirname, '/client/app.ts'),
    output: {
        filename: 'app.js',
        path: __dirname
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                use:  [  'style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            }
        ]
    },
    devServer: {
        historyApiFallback: true,
    },
    devtool: 'inline-source-map',
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'style.css',
          }),    
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            Popper: ['popper.js', 'default']
        }), 
    ],
    resolve: {
        extensions: [".ts", ".js"]
    }
};