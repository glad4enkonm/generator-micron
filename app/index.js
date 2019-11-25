  const Generator = require('yeoman-generator');
const _ = require('lodash');
const yosay = require('yosay');
const chalk = require('chalk');
const pkg = require('../package.json');
const dotnet = require('./helper/dotnet');
const sql = require('./mapping/sql');
const proto = require('./mapping/proto');
const core = require('./mapping/core');

let cache = {};

function createSolutionAndProjects(answers) {
  /* */
  dotnet.new_solution(answers.name);
  
  dotnet.new_console_project("Core");
  dotnet.new_console_project("Database");
  
  dotnet.add_project_to_solution("Core", answers.name);
  dotnet.add_project_to_solution("Database", answers.name);

  dotnet.add_package_to_project("dbup", "Database", "4.2.0");
  
  dotnet.add_package_to_project("Microsoft.Extensions.Logging", "Core", "2.2.0");
  dotnet.add_package_to_project("Microsoft.Extensions.Logging.Console", "Core", "2.2.0");
  dotnet.add_package_to_project("Microsoft.Extensions.Hosting", "Core", "2.2.0");
  dotnet.add_package_to_project("Microsoft.Extensions.DependencyInjection", "Core", "2.2.0");
  dotnet.add_package_to_project("Microsoft.Extensions.Configuration.Json", "Core", "2.2.0");
  dotnet.add_package_to_project("Microsoft.Extensions.Configuration", "Core", "2.2.0");
}

function copyDbFiles(that) {  // to do: defactor to separete generators
  that.fs.copyTpl(that.templatePath("Database/_Program.cs"), that.destinationPath("Database/Program.cs"));
  that.fs.copyTpl(that.templatePath("Common/_runtimeconfig.json"), that.destinationPath("Database/Database.runtimeconfig.json"));
  const dataToRender = sql.prepareData(that.config.get("proto"));
  
  that.fs.copyTpl(
    that.templatePath("Database/ScriptInit0001.sql"), 
    that.destinationPath("Database/Scripts/ScriptInit0001.sql"),
    dataToRender
  );
  
}

function copyProtoFiles(that) {  
  const dataToRender = proto.prepareData(that.config.get("proto"));
  cache.protoDataToRender = dataToRender;

  that.fs.copyTpl(
    that.templatePath("Proto/_.proto"), 
    that.destinationPath(`Proto/${dataToRender.package}.proto`),    
    dataToRender
  );

  that.fs.copyTpl(
    that.templatePath("Proto/CSharp/_Broadcast.csproj"), 
    that.destinationPath(`Proto/CSharp/Broadcast.${dataToRender.packagePascalCase}.csproj`),    
    dataToRender
  );

  that.fs.copyTpl(
    that.templatePath("Proto/CSharp/Validation/_CommonValidator.cs"), 
    that.destinationPath("Proto/CSharp/Validation/CommonValidator.cs"),    
    dataToRender
  );

  dataToRender.validatorList.map(validator => {    
    that.fs.copyTpl(
        that.templatePath("Proto/CSharp/Validation/_CustomValidator.cs"), 
      that.destinationPath(`Proto/CSharp/Validation/${validator.namePascalCase}Validator.cs`),
      validator
    );
  });  
}

function copyCoreFiles(that) {  
  if (!cache.protoDataToRender) // fill cache
    cache.protoDataToRender = proto.prepareData(that.config.get("proto"));

  const dataToRender = core.prepareData(that.config.get("proto"), cache);

  that.fs.copyTpl(
    that.templatePath("Core/Grpc/_Server.cs"), 
    that.destinationPath(`Core/Grpc/${dataToRender.packagePascalCase}Server.cs`),    
    dataToRender
  );
  
  that.fs.copyTpl(
    that.templatePath("Core/Business/Interface/_IServerLogic.cs"), 
    that.destinationPath(`Core/Business/Interface/I${dataToRender.packagePascalCase}ServerLogic.cs`),    
    dataToRender
  );
}

function build() {
  dotnet.build_project("Database");
  dotnet.build_project("Proto\\CSharp\\Broadcast.Project.csproj");
}

module.exports = class extends Generator {
    async prompting() {
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

    writing() {
      createSolutionAndProjects(this.answers);
      copyDbFiles(this);
      copyProtoFiles(this);
      copyCoreFiles(this);
    }

    install() {
      build();
    }
}