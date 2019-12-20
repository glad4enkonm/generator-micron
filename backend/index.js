const Generator = require('yeoman-generator');
const _ = require('lodash');
const yosay = require('yosay');
const chalk = require('chalk');
const proto = require('../mapping/proto');
const backend = require('../mapping/backend');
const pkg = require('../package.json');

const filterHelper = require('../helper/filter');      

let cache = {};

function copyClientFiles() {
    if (!cache.protoDataToRender) // fill cache
      cache.protoDataToRender = proto.prepareData(this.answers.proto);
  
    const dataToRender = backend.prepareData(this.answers.proto, cache);
    this.copyWithAFilter(this.templatePath("Helper/_EndpointHelper.cs"), this.destinationPath("Helper/EndpointHelper.cs"));
  
    this.copyTplWithAFilter(this.templatePath("Controller/_Controller.cs"),
      this.destinationPath(`Controller/${dataToRender.packagePascalCase}Controller.cs`), dataToRender);

    this.copyTplWithAFilter(this.templatePath("GRPC/Interface/_IClient.cs"),
      this.destinationPath(`GRPC/Interface/I${dataToRender.packagePascalCase}Client.cs`), dataToRender);
      
    this.copyTplWithAFilter(this.templatePath("GRPC/_Client.cs"),
      this.destinationPath(`GRPC/${dataToRender.packagePascalCase}Client.cs`), dataToRender);
}

module.exports = class extends Generator {
    initializing() {
      const config = this.config.getAll();
      this.answers = {...config.promptValues, proto: config.proto};
      this.answers.filter = this.options.filter;

      this.log(filterHelper);

      this.copyTplWithAFilter = filterHelper.copyTplWithAFilter.bind(this);
      this.copyWithAFilter = filterHelper.copyTplWithAFilter.bind(this);
      this.copyClientFiles = copyClientFiles.bind(this);
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
        this.copyClientFiles();

        const dataToRender = proto.prepareData(this.answers.proto);
        if (this.answers.outputRenderData) {
            this.fs.writeJSON('dataToRender.json', dataToRender);
        }
    }
}