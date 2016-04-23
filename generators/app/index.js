'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var mkdirp = require('mkdirp');
var snakecase = require('lodash.snakecase');

module.exports = yeoman.Base.extend({

  prompting: function () {
    var done = this.async();

    this.log(yosay(
      'Welcome to the slick ' + chalk.red('generator-gulp-drupal') + ' generator!'
    ));

    var currentDirName = path.basename(this.destinationRoot());
    var defaultName = snakecase(currentDirName);
    var prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Your project name (Auto convert to Snake case)',
        default: defaultName
      },
      {
        type: 'input',
        name: 'description',
        message: 'Your project description',
        default: 'Drupal theme with Gulp, Babel, UglifyJS, PostCSS,  Imagemin, BrowserSync.'
      },
      {
        type: 'input',
        name: 'drupalURL',
        message: 'Your Drupal project URL (BrowserSync proxy target)',
        default: defaultName + '.local'
      }
    ];

    this.prompt(prompts, function (props) {
      this.props = props;
      done();
    }.bind(this));
  },

  writing: function () {
    this.fs.copy(
      this.templatePath('dist'),
      this.destinationPath('dist')
    );
    this.fs.copy(
      this.templatePath('src'),
      this.destinationPath('src')
    );
    mkdirp.sync(this.destinationPath('src/images'));
    mkdirp.sync(this.destinationPath('src/fonts'));
    mkdirp.sync(this.destinationPath('templates'));
    this.fs.copyTpl(
      this.templatePath('_bower.json'),
      this.destinationPath('bower.json'),
      this.props
    );
    this.fs.copy(
      this.templatePath('_GULP_DRUPAL.md'),
      this.destinationPath('GULP_DRUPAL.md')
    );
    this.fs.copyTpl(
      this.templatePath('_gulpfile.babel.js'),
      this.destinationPath('gulpfile.babel.js'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('_template.php'),
      this.destinationPath('template.php'),
      this.props
    );
    this.fs.copy(
      this.templatePath('babelrc'),
      this.destinationPath('.babelrc')
    );
    this.fs.copy(
      this.templatePath('bowerrc'),
      this.destinationPath('.bowerrc')
    );
    this.fs.copy(
      this.templatePath('eslintrc'),
      this.destinationPath('.eslintrc')
    );
    this.fs.copy(
      this.templatePath('npmrc'),
      this.destinationPath('.npmrc')
    );
  },

  install: function () {
    this.installDependencies();
  }
});
