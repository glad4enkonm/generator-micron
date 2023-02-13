const Generator = require('yeoman-generator');
const _ = require('lodash');
const yosay = require('yosay');
const chalk = require('chalk');
const proto = require('../mapping/proto');
const core = require('../mapping/core');
const pkg = require('../package.json');

const filterHelper = require('../helper/filter');

let cache = {};

function copyFiles() {  
  if (!cache.protoDataToRender) // fill cache
    cache.protoDataToRender = proto.prepareData(this.answers.proto);

  const dataToRender = core.prepareData(this.answers.proto, cache);

  this.copyTplWithAFilter(this.templatePath("Common/_runtimeconfig.json"), this.destinationPath("Core/Core.runtimeconfig.json"));

  this.copyTplWithAFilter(
    this.templatePath("Core/Grpc/_Server.cs"), 
    this.destinationPath(`Core/Grpc/${dataToRender.packagePascalCase}Server.cs`),    
    dataToRender
  );
  
  this.copyTplWithAFilter(
    this.templatePath("Core/Business/Interface/_IServerLogic.cs"), 
    this.destinationPath(`Core/Business/Interface/I${dataToRender.packagePascalCase}ServerLogic.cs`),    
    dataToRender
  );

  this.copyTplWithAFilter(
    this.templatePath("Core/Business/_ServerLogic.cs"), 
    this.destinationPath(`Core/Business/${dataToRender.packagePascalCase}ServerLogic.cs`),    
    dataToRender
  );
  
  this.copyTplWithAFilter(
    this.templatePath("Core/Repository/_DataRepositoryBase.cs"), 
    this.destinationPath("Core/Repository/DataRepositoryBase.cs"),
    dataToRender
  );

  this.copyTplWithAFilter(this.templatePath("Core/_Program.cs"), 
    this.destinationPath("Core/Program.cs"), dataToRender);

  this.copyTplWithAFilter(this.templatePath("Core/_config.json"), 
    this.destinationPath("Core/config.json"), dataToRender);

  // to do: add other microservice mappings
  this.copyTplWithAFilter(this.templatePath("Core/Mapper/_Profile.cs"), 
    this.destinationPath(`Core/Mapper/${dataToRender.packagePascalCase}Profile.cs`), dataToRender);

  this.copyWithAFilter(this.templatePath("Core/Helper/_SqlHelper.cs"), this.destinationPath("Core/Helper/SqlHelper.cs"));
  this.copyWithAFilter(this.templatePath("Core/Helper/_GrpcHelper.cs"), this.destinationPath("Core/Helper/GrpcHelper.cs"));
  this.copyWithAFilter(this.templatePath("Core/Helper/_ExceptionHelper.cs"), this.destinationPath("Core/Helper/ExceptionHelper.cs"));
  this.copyWithAFilter(this.templatePath("Core/Helper/_ConfigHelper.cs"), this.destinationPath("Core/Helper/ConfigHelper.cs"));

  this.copyWithAFilter(this.templatePath("Core/Repository/Interface/_IDataRepository.cs"), 
    this.destinationPath("Core/Repository/Interface/IDataRepository.cs"));

  dataToRender.messageList.map(message => {    
    this.copyTplWithAFilter(
      this.templatePath("Core/Model/_Model.cs"), 
      this.destinationPath(`Core/Model/${message.namePascal}.cs`),
      message
    );
    this.copyTplWithAFilter(
      this.templatePath("Core/Repository/Interface/_IRepository.cs"),
      this.destinationPath(`Core/Repository/Interface/I${message.namePascal}Repository.cs`),
      message
    );
    this.copyTplWithAFilter(
      this.templatePath("Core/Repository/_Repository.cs"),
      this.destinationPath(`Core/Repository/${message.namePascal}Repository.cs`),
      message
    );
  });
}

module.exports = class extends Generator {
    initializing() {
      const config = this.config.getAll();
      this.answers = {...config.promptValues, proto: config.proto};
      this.answers.filter = this.options.filter;
      
      this.copyTplWithAFilter = filterHelper.copyTplWithAFilter.bind(this);
      this.copyWithAFilter = filterHelper.copyTplWithAFilter.bind(this);
      this.copyFiles = copyFiles.bind(this);
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
      this.copyFiles();

      const dataToRender = proto.prepareData(this.answers.proto);
      if (this.answers.outputRenderData) {
        this.fs.writeJSON('dataToRender.json', dataToRender);
      }
    }
}