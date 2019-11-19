const Generator = require('yeoman-generator');
const _ = require('lodash');
const yosay = require('yosay');
const chalk = require('chalk');
const pkg = require('../package.json');
const dotnet = require('./dotnet');
const sql = require('./mapping/sql');

function create_solution_and_projects(answers) {
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

function copy_db_files(that) {  
  that.fs.copyTpl(that.templatePath("Database/_Program.cs"), that.destinationPath("Database/Program.cs"));
  that.fs.copyTpl(that.templatePath("Common/_runtimeconfig.json"), that.destinationPath("Database/Database.runtimeconfig.json"));
  const data_to_render = sql.prepareData(that.config.get("proto"));
  
  that.fs.copyTpl(
    that.templatePath("Database/ScriptInit0001.sql"), 
    that.destinationPath("Database/Scripts/ScriptInit0001.sql"),
    data_to_render
  );
}

module.exports = class extends Generator {
    async prompting() {
      this.log(yosay('Welcome to the Yeoman ' + chalk.green('micron') + ' (' + pkg.version + ')' + ' generator!'));
      
      this.answers = await this.prompt([
        {
          type: "input",
          name: "name",
          message: "Microservice name"
        }
      ]);
    }

    writing() {
      create_solution_and_projects(this.answers);
      copy_db_files(this);
    }
}