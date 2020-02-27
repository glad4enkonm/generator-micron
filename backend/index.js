const Generator = require('yeoman-generator');
const _ = require('lodash');
const yosay = require('yosay');
const chalk = require('chalk');
const proto = require('../mapping/proto');
const backend = require('../mapping/backend');
const pkg = require('../package.json');

const filterHelper = require('../helper/filter');      

let cache = {};

function copyFiles() {
    if (!cache.protoDataToRender) // fill cache
      cache.protoDataToRender = proto.prepareData(this.answers.proto);
  
    const dataToRender = backend.prepareData(this.answers.proto, cache);
    this.copyWithAFilter(this.templatePath("Middleware/_ExceptionMiddleware.cs"), this.destinationPath("Middleware/ExceptionMiddleware.cs"));
  
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
      this.copyFiles = copyFiles.bind(this);
    } 


    async prompting() {      
      if (!this.answers.name) {
        this.log(yosay('Welcome to the Yeoman ' + chalk.green('micron') + ' (' + pkg.version + ')' + ' generator!'));
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
        if (this.options.calledFromApp) { // save dest path and update it
          this.answers.root = this.destinationRoot();
          this.destinationRoot("Backend")
        }
        
        this.copyFiles();

        const dataToRender = proto.prepareData(this.answers.proto);
        if (this.answers.outputRenderData) {
            this.fs.writeJSON('dataToRender.json', dataToRender);
        }

        if (this.options.calledFromApp) // reset dest path
          this.destinationRoot(this.answers.root);
    }    
}