let gulp = require('gulp');
let webpackStream = require('webpack-stream');
let webpack = require('webpack');
let path = require('path');
let named = require('vinyl-named');
let scss = require('gulp-sass');
let autoprefixer = require('gulp-autoprefixer');
let browserSync = require('browser-sync');
let webpackDevMiddleware = require('webpack-dev-middleware');

// config

let paths = {
  src: 'src',
  dest: 'build'
};

paths.js = {
  src: [
    path.join(paths.src, 'js', 'app.js'),
    path.join(paths.src, 'js', 'vendor.js')
  ],
  dest: path.join(paths.dest, 'js')
};

paths.templates = {
  src: path.join(paths.src, 'templates', '**/*'),
  dest: paths.dest
};

paths.scss = {
  src: path.join(paths.src, 'scss', '*.scss'),
  dest: path.join(paths.dest, 'css')
};

let options = {
  devtool: "cheap-eval-source-map"
};

let webpackConfig = {
  devtool: options.devtool,
  output: {
    publicPath: 'js/',
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }, {
      test: /\.(sass|scss)$/,
      use: [
        'style-loader',
        'css-loader',
        'sass-loader',
      ]
    }, {
      test: /\.js$/,
      use: [{
        loader: 'babel-loader',
        options: { presets: ['es2015'] }
      }]
    }]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor' // Specify the common bundle's name.
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: options.devtool && (options.devtool.indexOf("sourcemap") >= 0 || options.devtool.indexOf("source-map") >= 0)
    })
  ]
};

// tasks

gulp.task('js', function () {
  gulp.src(paths.js.src)
    .pipe(named())
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest(paths.js.dest));
});

gulp.task('scss', function () {
  gulp.src(paths.scss.src)
    .pipe(scss())
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.scss.dest));
});


gulp.task('templates', function() {
  gulp.src(paths.templates.src)
    .pipe(gulp.dest(paths.templates.dest))
});


gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: paths.dest,
    }
  });
});


gulp.task('default', ['js', 'templates', 'scss']);