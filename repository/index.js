const Generator = require("yeoman-generator")
const sql = require("../common/sql")
const repository = require("../common/repository")

function copyFiles(that) {

    if (that.answers.entity.hasOwnProperty("generation") && that.answers.entity.generation.repository == false)
        return // пропускаем если у элемента есть указание не создавать репозиторий

    const dataToRender = repository.prepareData(sql.prepareData(that.answers.entity))
    console.log(JSON.stringify(dataToRender))
    const modelsDir = that.options.calledFromApp ? 'database/Models/' : 'Models/'

    that.fs.copyTpl(
        that.templatePath("Models/_Model.cs"),
        that.destinationPath(`${modelsDir}${dataToRender.name}.cs`),
        dataToRender
    )

    const repositoryDir = that.options.calledFromApp ? 'database/Repository/' : 'Repository/'
    that.fs.copyTpl(
        that.templatePath("Repository/_Repository.cs"),
        that.destinationPath(`${repositoryDir}${dataToRender.name}Repository.cs`),
        dataToRender
    )
}

module.exports = class extends Generator {
    pkg;
    initializing() {
        const config = this.config.getAll();
        this.answers = {
            ...config.promptValues,
            entity: config.entity
        };
    }

    async prompting() {
        this.log('Repository generator ...');
    }

    writing() {
        copyFiles(this);
    }

    install() {
    }
}