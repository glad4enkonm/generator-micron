const Generator = require('yeoman-generator');
const _ = require('lodash');
const dotnet = require('../helper/dotnet');
const proto = require('../mapping/proto');

let cache = {};

function copyProtoFiles(that) {  
  const dataToRender = proto.prepareData(that.answers.proto);
  cache.protoDataToRender = dataToRender;

  that.fs.copyTpl(
    that.templatePath("_.proto"), 
    that.destinationPath(`${dataToRender.package}.proto`),    
    dataToRender
  );

  that.fs.copyTpl(
    that.templatePath("CSharp/_Broadcast.csproj"), 
    that.destinationPath(`CSharp/Broadcast.${dataToRender.packagePascalCase}.csproj`),    
    dataToRender
  );

  that.fs.copyTpl(
    that.templatePath("CSharp/Validation/_CommonValidator.cs"), 
    that.destinationPath("CSharp/Validation/CommonValidator.cs"),    
    dataToRender
  );

  dataToRender.validatorList.map(validator => {    
    that.fs.copyTpl(
        that.templatePath("CSharp/Validation/_CustomValidator.cs"), 
      that.destinationPath(`CSharp/Validation/${validator.namePascalCase}Validator.cs`),
      validator
    );
  });  
}

module.exports = class extends Generator {
    initializing() {
      const config = this.config.getAll();
      this.answers = {...config.promptValues, proto: config.proto};
    }

    async prompting() {      
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
      copyProtoFiles(this);
    }

    install() {
      dotnet.build_project(`CSharp\\Broadcast.${this.answers.name}.csproj`);
    }
}