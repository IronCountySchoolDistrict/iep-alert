var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var config = require('./config.json');

var minimist = require('minimist');
var del = require('del');
var lazypipe = require('lazypipe');
var runSequence = require('run-sequence');

var knownOptions = {
  string: ['env'],
  default: {
    env: process.env.NODE_ENV || 'pstest2',
    'use-babel': true,
  }
};

var options = minimist(process.argv.slice(2), knownOptions);

gulp.task('deploy', function() {
  return gulp.src([
      'dist/web_root/scripts/**',
      'dist/web_root/images/**'
    ], {
      base: 'dist/web_root'
    })
    .pipe(plugins.debug())
    .pipe(deploy());
});

gulp.task('build-then-deploy', function(callback) {
  return runSequence('build', 'deploy', callback);
});

gulp.task('build', ['build-static', 'babel']);

gulp.task('build-static', function() {
  return gulp.src([
      'src/**',
      '!src/**/*.js',
      '!./src/web_root/scripts/**/*',
      '!./src/web_root/scripts'
    ])
    .pipe(plugins.debug())
    .pipe(gulp.dest('dist'));
});

gulp.task('package', function() {
  return gulp.src('dist/**')
    .pipe(plugins.debug())
    .pipe(plugins.zip('plugin.zip'))
    .pipe(gulp.dest('./'));
});

gulp.task('babel', function() {
  return gulp.src([
      './src/**/*.js'
    ], {
      base: './src/web_root'
    })
    .pipe(preprocess())
    .pipe(plugins.debug())
    .pipe(plugins.if(options['use-babel'], plugins.babel()))
    .pipe(gulp.dest('dist/web_root'));
});

var deploy = lazypipe()
  .pipe(function() {
    var env = options.env;
    return plugins.if(config.hasOwnProperty(env), plugins.sftp(config[env].deploy_credentials))
  });

var preprocess = lazypipe()
  .pipe(function() {
    var env = options.env;
    return plugins.if(config.hasOwnProperty(env), plugins.preprocess({
      context: {
        SAMS_URL: config[env].sams_url,
        API_URL: config[env].api_url
      }
    }));
  });

gulp.task('lint', function() {
  return gulp.src('src/**/*.js')
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format());
});
