const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');

const BUILD_ENV = process.env.BUILD_ENV;

const BUILD_ENV_LOCAL = 'local';
const BUILD_ENV_PRODUCTION = 'production';

const PATH_SRC_DIR = path.join(__dirname, 'src');
const PATH_DIST_DIR = path.join(__dirname, 'dist');
const PATH_DEPS_DIR = path.join(__dirname, 'node_modules');

/*
 instead of .babelrc
 */
const babelLoaderOptions = {
  plugins: [
    'transform-runtime'
  ],
  presets: [
    ['es2015', { modules: false }]
  ],
  sourceMaps: false
};

/*
instead of postcss.config.js
 */
const postCssLoaderOptions = {
  plugins: () => [
    autoprefixer({ browsers: ['last 5 versions'], cascade: false })
  ]
};

const urlLoaderOptions = {
  name: '[hash].[ext]',
  limit: 10000
};

const uglifyJsPluginOptions = {
  beautify: false,
  mangle: {
    screw_ie8: true
  },
  compress: {
    warnings: false,
    screw_ie8: true
  },
  comments: false
};

const webpackConfig = {
  entry: {
    application: [
      path.join(PATH_SRC_DIR, 'styles/main.scss'),
      path.join(PATH_SRC_DIR, 'scripts/main.js')
    ]
  },
  output: {
    path: PATH_DIST_DIR,
    publicPath: '/',
    filename: '[hash].js',
  },
  resolve: {
    extensions: ['.js', '.scss', '.html']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [PATH_DEPS_DIR],
        use: [
          { loader: 'babel-loader', options: babelLoaderOptions }
        ]
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'postcss-loader', options: postCssLoaderOptions }
        ]
      },
      {
        test: /\.s(a|c)ss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'postcss-loader', options: postCssLoaderOptions },
          { loader: 'sass-loader' }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|ico|ttf|eot|svg|woff2?)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          { loader: 'url-loader', options: urlLoaderOptions }
        ]
      }
    ]
  },
  plugins: [
    new CleanPlugin([PATH_DIST_DIR], { verbose: false }),
    new webpack.ProvidePlugin({ '$': 'jquery', 'jQuery': 'jquery', 'window.jQuery': 'jquery' })
  ]
};

switch (BUILD_ENV) {
  case BUILD_ENV_LOCAL: {
    webpackConfig.watch = true;
    webpackConfig.devtool = 'source-map';
    // enabling babel-loader source maps
    webpackConfig.module.rules[0].use[0].options.sourceMaps = true;
    webpackConfig.output.sourceMapFilename = '[name].map';
    // consistent bundle name to prevent dist dir from growing on every reload
    webpackConfig.output.filename = '[name].js';
    webpackConfig.plugins.push(
      new webpack.DefinePlugin({
        _EXTERNAL_ENV: JSON.stringify(BUILD_ENV_LOCAL),
        _EXTERNAL_GOOGLE_ANALYTICS_ID: JSON.stringify(null)
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: false,
        debug: true
      }),
      new HtmlPlugin({
        template: path.join(PATH_SRC_DIR, 'templates/index.html'),
        filename: 'index.html',
        inject: 'head',
        chunksSortMode: 'dependency'
      }),
      new BrowserSyncPlugin({
        host: 'localhost',
        port: 3000,
        server: { baseDir: [PATH_DIST_DIR] },
        ui: false
      })
    );
    break;
  }
  case BUILD_ENV_PRODUCTION: {
    webpackConfig.plugins.push(
      new webpack.DefinePlugin({
        _EXTERNAL_ENV: JSON.stringify(BUILD_ENV_LOCAL),
        _EXTERNAL_GOOGLE_ANALYTICS_ID: JSON.stringify(null) // TODO : add GA ID
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      }),
      new webpack.optimize.UglifyJsPlugin(uglifyJsPluginOptions),
      new HtmlPlugin({
        template: path.join(PATH_SRC_DIR, 'templates/index.html'),
        filename: 'index.html',
        inject: 'body',
        chunksSortMode: 'dependency'
      })
    );
    break;
  }
  default: {
    break;
  }
}

webpack(webpackConfig, (error, stats) => {
  if (error) {
    console.log(
      '\n' +
      error +
      '\n'
    );
    return;
  }

  console.log(
    '\n' +
    stats.toString({ colors: true, chunks: false }) +
    '\n'
  );
});
