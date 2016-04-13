'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.Base.extend({

  prompting: function () {
    var done = this.async();

    this.log(yosay(
      'Welcome to the slick ' + chalk.red('generator-gulp-drupal') + ' generator!'
    ));

    var prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        default: this.appname
      },
      {
        type: 'input',
        name: 'description',
        message: 'Your project description',
        default: 'Drupal theme with Gulp, Babel, PostCSS, UglifyJS, Imagemin, Browser sync.'
      },
      {
        type: 'input',
        name: 'devURL',
        message: 'Your project devURL ?',
        default: this.appname + '.local'
      }
    ];

    this.prompt(prompts, function (props) {
      this.props = props;
      done();
    }.bind(this));
  },

  writing: function () {
    this.fs.directory('src', 'src');
    this.fs.copyTpl(
      this.templatePath('_bower.json'),
      this.destinationPath('bower.json'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('_gulpfile.babel'),
      this.destinationPath('gulpfile.babel'),
      this.props
    );
    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      this.props
    );
    this.fs.copy(
      this.templatePath('babelrc'),
      this.destinationPath('.babelrc')
    );
    this.fs.copy(
      this.templatePath('eslintrc'),
      this.destinationPath('.eslintrc')
    );
  },

  install: function () {
    this.installDependencies();
  }
});
