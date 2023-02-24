const Generator = require("yeoman-generator")
const sql = require("../common/sql")
const repository = require("../common/repository")
const controller = require("../common/controller");
const store = require("../common/store");
const {firstLetterToLowerCase} = require("../common/naming");

function copyFiles(that) {
    const preparedEntities = that.answers.entities.map(entity =>
        store.prepareData(controller.prepareData(repository.prepareData(sql.prepareData(entity)))))

    const usedControllerNames = preparedEntities // делим по store так же как по controller
        .filter(entity => !entity.hasOwnProperty("generation") || entity.generation?.store != false)
        .map(entity => entity.generation.controller).filter(name => name !== false)

    usedControllerNames.map(storeName => {
        const entitiesForStore = preparedEntities
            .filter(entity => !entity.hasOwnProperty("generation") || entity.generation?.store != false)
            .filter(entity => entity.generation.controller == storeName)

        if (entitiesForStore.length == 0) return null

        const controllersDir = 'front/'
        that.fs.copyTpl(
            that.templatePath("_store.ts_"),
            that.destinationPath(`${controllersDir}store/${firstLetterToLowerCase(storeName)}.ts`),
            { nameCamelCase : firstLetterToLowerCase(storeName), entities: entitiesForStore}
        )

        that.fs.copyTpl(
            that.templatePath("_api.ts_"),
            that.destinationPath(`${controllersDir}api/${firstLetterToLowerCase(storeName)}.ts`),
            { nameCamelCase : firstLetterToLowerCase(storeName), name: storeName, entities: entitiesForStore}
        )

        entitiesForStore.map(entity => { // создаём модели для всех сущностей
            that.fs.copyTpl(
                that.templatePath("_model.ts_"),
                that.destinationPath(`${controllersDir}model/${firstLetterToLowerCase(entity.name)}.ts`),
                { entity : entity }
            )
        })
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
        this.log('Store generator ...');
    }

    writing() {
        copyFiles(this);
    }

    install() {
    }
}