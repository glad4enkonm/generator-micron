const Generator = require("yeoman-generator")
const sql = require("../common/sql")
const repository = require("../common/repository")
const controller = require("../common/controller");

function copyFiles(that) {
    const preparedEntities = that.answers.entities.map(entity =>
        controller.prepareData(repository.prepareData(sql.prepareData(entity))))

    const usedControllerNames = preparedEntities
        .map(entity => entity.generation.controller).filter(name => name !== false)


    usedControllerNames.map(controllerName => {
        const entitiesForController = preparedEntities
            .filter(entity => entity.generation.controller == controllerName)
        console.log(entitiesForController)

        const controllersDir = that.options.calledFromApp ? 'backend/Controllers/' : 'Controllers/'
        that.fs.copyTpl(
            that.templatePath("Controllers/_Controller.cs"),
            that.destinationPath(`${controllersDir}${controllerName}Controller.cs`),
            { entities : entitiesForController }
        )
    })
}

module.exports = class extends Generator {
    pkg;
    initializing() {
        //this.composeWith(require.resolve('../migrations'), [], {calledFromApp: false})
        //this.composeWith(require.resolve('../repository'), [], {calledFromApp: false})

        const config = this.config.getAll()
        this.answers = {
            ...config.promptValues,
            entities: config.entities
        }
    }

    async prompting() {
        this.log('Controller generator ...');
    }

    writing() {
        copyFiles(this);
    }

    install() {
    }
}