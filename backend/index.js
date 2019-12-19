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
    that.fs.copy(that.templatePath("Helper/_EndpointHelper.cs"), that.destinationPath("Helper/EndpointHelper.cs"));
  
    that.fs.copyTpl(that.templatePath("Controller/_Controller.cs"),
      that.destinationPath(`Controller/${dataToRender.packagePascalCase}Controller.cs`), dataToRender);  
    that.fs.copyTpl(that.templatePath("GRPC/Interface/_IClient.cs"),
      that.destinationPath(`GRPC/Interface/I${dataToRender.packagePascalCase}Client.cs`), dataToRender);
    that.fs.copyTpl(that.templatePath("GRPC/_Client.cs"),
      that.destinationPath(`GRPC/${dataToRender.packagePascalCase}Client.cs`), dataToRender);
}

function copyTplWithAFilter(source, destination, data) {  
  if (source.startsWith(this.templatePath(this.answers.filter)))
    this.fs.copyTplOriginal(source, destination, data);
}

function copyWithAFilter(source, destination) {
  if (source.startsWith(this.templatePath(this.answers.filter)))
    this.fs.copyOriginal(source, destination);
}

module.exports = class extends Generator {
    initializing() {
      const config = this.config.getAll();
      this.answers = {...config.promptValues, proto: config.proto};
      this.answers.filter = this.options.filter;
      if (this.answers.filter) {
        this.fs.copyTplOriginal = this.fs.copyTpl;
        this.fs.copyTpl = copyTplWithAFilter.bind(this);
        this.fs.copyOriginal = this.fs.copy;
        this.fs.copy = copyWithAFilter.bind(this);
      }
        
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