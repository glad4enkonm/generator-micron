var Generator = require('yeoman-generator');
var _ = require('lodash');
var yosay = require('yosay');
var chalk = require('chalk');
var pkg = require('../package.json');

module.exports = class extends Generator {
    prompting() {        
		this.log(yosay('Welcome to the Yeoman ' + chalk.green('micron') + ' (' + pkg.version + ')' + ' generator!'));
    }
}