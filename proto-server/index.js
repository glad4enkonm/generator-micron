const Generator = require('yeoman-generator');
const _ = require('lodash');
const dotnet = require('../helper/dotnet');
const proto = require('../mapping/proto');

module.exports = class extends Generator {
    initializing() {
        const config = this.config.getAll();
        this.answers = {
            ...config.promptValues,
            proto: config.proto
        };
    }

    async prompting() {
        if (!this.answers.name || !this.answers.languages) {
            const answers = await this.prompt([{
                    type: "input",
                    name: "name",
                    message: "Microservice name",
                    store: true
                },
                {
                    type: 'checkbox',
                    message: 'Select languages',
                    name: 'languages',
                    choices: ["csharp", "python"],
                    store: true
                },
                {
                    type: 'confirm',
                    message: 'Output render data',
                    name: 'outputRenderData',                    
                    store: true
                }
            ]);
            Object.assign(this.answers, answers);
        }
    }

    writing() {
        const dataToRender = proto.prepareData(this.answers.proto);
        if (this.answers.outputRenderData) {
            this.fs.writeJSON('dataToRender.json', dataToRender);
        }        

        this.fs.copyTpl(
            this.templatePath("grpc_service/_service_logic.py"),
            this.destinationPath(`grpc_service/${dataToRender.package}_service_logic.py`),
            dataToRender
        );

        this.fs.copyTpl(
            this.templatePath("grpc_service/_service.py"),
            this.destinationPath(`grpc_service/${dataToRender.package}_service.py`),
            dataToRender
        );
    }

    install() {
        dotnet.build_project(`CSharp\\Broadcast.${this.answers.name}.csproj`);
    }
}