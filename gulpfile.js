const gulp = require('gulp');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const sassGlob = require('gulp-sass-glob');
const browserSync = require( 'browser-sync' );
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssdeclsort = require('css-declaration-sorter');
const ejs = require("gulp-ejs");
const rename = require("gulp-rename");
const webpackStream = require("webpack-stream");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config");

// scssのコンパイル
gulp.task('sass', function() {
  return gulp
  .src( './src/assets/scss/**/*.scss' )
  .pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
  .pipe( sassGlob() )
  .pipe( sass({
  outputStyle: 'expanded'
  }) )
  .pipe( postcss([ autoprefixer(
  {
  // ☆IEは11以上、Androidは5以上
  // その他は最新2バージョンで必要なベンダープレフィックスを付与する
  "overrideBrowserslist": ["last 2 versions", "ie >= 11", "Android >= 5"],
  cascade: false}
  ) ]) )
  .pipe( postcss([ cssdeclsort({ order: 'alphabetical' }) ]) )
  .pipe(gulp.dest('./dist/assets/css'));
});

// 保存時のリロード
gulp.task( 'browser-sync', function(done) {
  browserSync.init({
    //ローカル開発
    server: {
      baseDir: "./dist",
      index: "index.html"
    }
  });
  done();
});

gulp.task( 'bs-reload', function(done) {
  browserSync.reload();
  done();
});

gulp.task("ejs", (done) => {
  gulp
  .src(["src/ejs/**/*.ejs", "!" + "ejs/_**/*.ejs"])
  .pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )
  .pipe(ejs())
  .pipe(rename({extname: ".html"}))
  .pipe(gulp.dest("./dist"));
  done();
});

// copyfile
gulp.task('copyfile', () => {
  return gulp.src([
       './src/assets/img/**/*',
       '!./src/assets/img/**/_*'
      ],
      {base:'src'}
    )
    .pipe(gulp.dest('./dist/'))
});

// webpack
gulp.task("webpack", () => {
  webpackConfig.mode = 'development';
  return webpackStream(webpackConfig, webpack)
    .pipe(gulp.dest("./dist/assets/js/"));
});


// 監視
gulp.task( 'watch', () => {
  gulp.watch('./src/assets/scss/**/*.scss', gulp.task('sass') );
  gulp.watch('./src/assets/scss/**/*.scss', gulp.task('bs-reload'));
  gulp.watch('./src/assets/js/**/*.js', gulp.task('bs-reload'));
  gulp.watch('./src/ejs/**/*.ejs',gulp.task('ejs'));
  gulp.watch('./src/ejs/**/*.ejs', gulp.task('bs-reload'));
  gulp.watch('./src/assets/img/**/*', gulp.task('copyfile'));
  gulp.watch('./src/assets/js/**/*.js', gulp.task('webpack'));
});

// default
gulp.task('default', gulp.series(gulp.parallel('browser-sync', 'watch')));