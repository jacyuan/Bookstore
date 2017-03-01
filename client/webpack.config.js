let path = require('path');
let webpack = require('webpack');

module.exports = {
    devtool: "source-map",
    entry: ['./main.js'],
    output: {path: __dirname, filename: 'dist/bundle.js'},
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react', 'stage-0']
                }
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            _: 'underscore'
        })
    ]
};
