import gulp from 'gulp';
import eslint from 'gulp-eslint';
import gIf from 'gulp-if';
import browserSync from 'browser-sync';
import newer from 'gulp-newer';
import sourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import sass from 'gulp-sass';
import filter from 'gulp-filter';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import cache from 'gulp-cache';
import imagemin from 'gulp-imagemin';
import del from 'del';
import runSequence from 'run-sequence';

const ENV = process.env.NODE_ENV || 'development';
const PROD = ENV === 'production';
const bs = browserSync.create();

gulp.task('lint', () => {
  return gulp.src(['src/scripts/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(gIf(PROD, eslint.failOnError()));
});

gulp.task('scripts', () => {
  return gulp.src(['src/scripts/**/*.js'])
    .pipe(newer('dist/scripts'))
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write())
    .pipe(gIf(PROD, uglify({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      }
    })))
    .pipe(gulp.dest('dist/scripts'));
});

gulp.task('styles', () => {
  let cssFilter = filter('**/*.css');
  let postCSSPlugins = [
    autoprefixer({
      browsers: [
        'ie >= 10',
        'ie_mob >= 10',
        'ff >= 30',
        'chrome >= 34',
        'safari >= 7',
        'opera >= 23',
        'ios >= 7',
        'android >= 4.4',
        'bb >= 10'
      ]
    })
  ];
  if (PROD) {
    postCSSPlugins.push(cssnano({
      safe: true,
      discardComments: {removeAll: true}
    }));
  }
  return gulp.src([
      'src/styles/**/*.scss',
      'src/styles/**/*.css',
      '!src/styles/**/_*.scss'
    ])
    .pipe(newer('dist/styles'))
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(cssFilter)
    .pipe(postcss(postCSSPlugins))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/styles'))
    .pipe(bs.stream({match: '**/*.css'}));
});

gulp.task('images', () => {
  return gulp.src(['src/images/**/*.{jpg,png,gif,svg}'])
    .pipe(gIf(PROD, cache(imagemin({
      progressive: true,
      interlaced: true
    }))))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', () => {
  return gulp.src(['src/fonts/**/*.{ttf,eot,svg,woff,woff2}'])
    .pipe(newer('dist/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('clean', () => {
  del.sync(['dist/*', '!dist/README.md'], {dot: true});
});

gulp.task('build', (callback) => {
  runSequence('clean', 'scripts', 'styles', 'images', 'fonts', callback);
});

gulp.task('start', ['build'], () => {
  bs.init({
    proxy: {
      target: '<%= drupalURL %>',
      ws: true
    }
  });

  gulp.watch(['src/scripts/**/*.js'], ['lint', 'scripts', bs.reload]);
  gulp.watch(['src/styles/**/*.{scss,css}'], ['styles']);
  gulp.watch(['src/images/**/*.{jpg,png,gif,svg}'], ['images', bs.reload]);
  gulp.watch(['src/fonts/**/*.{ttf,eot,svg,woff,woff2}'], ['fonts', bs.reload]);
  gulp.watch(['templates/**/*.tpl.php'], bs.reload);
  gulp.watch(['package.json', 'bower.json'], ['removeVendorInfoFile']);
});

gulp.task('removeVendorInfoFile', () => {
  del.sync(['node_modules/**/*.info', 'bower_components/**/*.info']);
});

gulp.task('postInstall', (callback) => {
  runSequence('removeVendorInfoFile', 'build', callback);
});