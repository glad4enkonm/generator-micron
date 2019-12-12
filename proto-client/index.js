const Generator = require('yeoman-generator');
const _ = require('lodash');
const yosay = require('yosay');
const chalk = require('chalk');
const proto = require('../mapping/proto');
const backend = require('../mapping/backend');
const pkg = require('../package.json');

let cache = {};

function copyClientFiles(that) {
    if (!cache.protoDataToRender) // fill cache
      cache.protoDataToRender = proto.prepareData(that.answers.proto);
  
    const dataToRender = backend.prepareData(that.answers.proto, cache);
    that.fs.copyTpl(that.templatePath("Interface/_IClient.cs"),
      that.destinationPath(`Interface/I${dataToRender.packagePascalCase}Client.cs`), dataToRender);
    that.fs.copyTpl(that.templatePath("_Client.cs"),
      that.destinationPath(`${dataToRender.packagePascalCase}Client.cs`), dataToRender);
  }

  module.exports = class extends Generator {
    initializing() {
      const config = this.config.getAll();
      this.answers = {...config.promptValues, proto: config.proto};
    } 

    async prompting() {
      this.log(yosay('Welcome to the Yeoman ' + chalk.green('micron') + ' (' + pkg.version + ')' + ' generator!'));
      
      if (!this.answers.name) {
        this.answers = await this.prompt([
          {
            type: "input",
            name: "name",
            message: "Microservice name",
            store: true
          } 
        ]);
      }
    }

    writing() {
        copyClientFiles(this);
    }
}