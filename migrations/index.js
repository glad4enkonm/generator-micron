const Generator = require("yeoman-generator")
const sql = require("../common/sql")
const fs = require('fs')
const {pad} = require("../common/naming");

function copyDbFiles(that) {
    const migrationsSubdir = that.options.calledFromApp ? 'database/Migrations/' : 'Migrations/'
    const files = fs.readdirSync(process.cwd() + '/' + migrationsSubdir)
    files.sort().reverse()
    const newMigrationNumber = files.length > 0 ? Number(files[0].split('_')[0]) + 1 : 0

    that.answers.entities.map(entity => {
        if (entity.hasOwnProperty("generation") && entity.generation.migrations == false)
            return // пропускаем если у элемента есть указание не создавать

        const dataToRender = sql.prepareData(entity)

        that.fs.copyTpl(
            that.templatePath("Migrations/_000N_DESC.sql"),
            that.destinationPath(migrationsSubdir +
                `${pad(newMigrationNumber + that.answers.entities.indexOf(entity),4)}_${dataToRender.name}.sql`),
            dataToRender
        )
    })

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
        this.log('Migrations generator...');

    }

    writing() {
        copyDbFiles(this);
    }

    install() {
    }
}