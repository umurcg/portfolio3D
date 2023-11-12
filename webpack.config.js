const path = require('path');

module.exports = {
  entry: './src/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'docs'),
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.fbx$/,  // This will apply the file-loader to all .fbx files
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets/models/',  // Output .fbx files to 'docs/assets/models/'
              name: '[name].[ext]',  // Keep the original file name
            },
          },
        ],
      },
      // ... include other rules if necessary ...
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'docs'),
    },
    compress: true,
    port: 9000,
  },
};
