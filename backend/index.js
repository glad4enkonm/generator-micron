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
    copyWithAFilter(that.templatePath("Helper/_EndpointHelper.cs"), that.destinationPath("Helper/EndpointHelper.cs"));
  
    copyTplWithAFilter(that.templatePath("Controller/_Controller.cs"),
      that.destinationPath(`Controller/${dataToRender.packagePascalCase}Controller.cs`), dataToRender);  
    copyTplWithAFilter(that.templatePath("GRPC/Interface/_IClient.cs"),
      that.destinationPath(`GRPC/Interface/I${dataToRender.packagePascalCase}Client.cs`), dataToRender);
    copyTplWithAFilter(that.templatePath("GRPC/_Client.cs"),
      that.destinationPath(`GRPC/${dataToRender.packagePascalCase}Client.cs`), dataToRender);
}

function copyTplWithAFilter(source, destination, data) {  
  if (this.answers.filter && source.startsWith(this.templatePath(this.answers.filter)))
    this.fs.copyTpl(source, destination, data);
}

function copyWithAFilter(source, destination) {
  if (this.answers.filter && source.startsWith(this.templatePath(this.answers.filter)))
    this.fs.copy(source, destination);
}

module.exports = class extends Generator {
    initializing() {
      const config = this.config.getAll();
      this.answers = {...config.promptValues, proto: config.proto};
      this.answers.filter = this.options.filter;

      copyTplWithAFilter = copyTplWithAFilter.bind(this);
      copyWithAFilter = copyTplWithAFilter.bind(this);
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

        const dataToRender = proto.prepareData(this.answers.proto);
        if (this.answers.outputRenderData) {
            this.fs.writeJSON('dataToRender.json', dataToRender);
        }
    }
}