const Generator = require("yeoman-generator")
const sql = require("../common/sql")
const repository = require("../common/repository")
const {appendHistoryEntities} = require("../common/history");

function copyFiles(that) {
    appendHistoryEntities(that)
    const programDir = that.options.calledFromApp ? 'database/' : ''
    that.answers.entities.map(entity => {
        if (entity.hasOwnProperty("generation") && entity.generation.repository == false)
            return // пропускаем если у элемента есть указание не создавать репозиторий

        const dataToRender = repository.prepareData(sql.prepareData(entity))

        let modelsDir = that.options.calledFromApp ? 'database/Models/' : 'Models/'
        let repositoryDir = that.options.calledFromApp ? 'database/Repository/' : 'Repository/'
        if (entity.generation.isHistoryEnabled == true || entity.name.endsWith("History")) {
            modelsDir += "History/"
            repositoryDir += "History/"
        }

        that.fs.copyTpl(
            that.templatePath("Models/_Model.cs"),
            that.destinationPath(`${modelsDir}${dataToRender.name}.cs`),
            dataToRender
        )

        if (entity.name.endsWith("History"))
            return // используем новые базовые классы, не нужно создавать отдельные репозитории

        that.fs.copyTpl(
            that.templatePath("Repository/_Repository.cs"),
            that.destinationPath(`${repositoryDir}${dataToRender.name}Repository.cs`),
            dataToRender
        )
    })
    that.fs.copyTpl(
        that.templatePath("_Program.cs"),
        that.destinationPath(`${programDir}Program.cs`),
        { entities : that.answers.entities }
    )

}

module.exports = class extends Generator {
    pkg;
    initializing() {
        const config = this.config.getAll();
        this.answers = {
            ...config.promptValues,
            entities: config.entities
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