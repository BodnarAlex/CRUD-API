const path = require('path')

module.exports = (env) => ({
  mode: env.mode ?? 'development',

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  entry: path.resolve(__dirname, 'src', 'index.ts'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'server.js',
    clean: true,
  },
  optimization: {
    minimize: false,
  },
  module: {
    rules: [
      {
        test: /\.([cm]?ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
});