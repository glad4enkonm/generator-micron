const Generator = require("yeoman-generator")
const sql = require("../common/sql")
const fs = require('fs')
const {pad} = require("../common/naming");

function copyDbFiles(that) {

    if (that.answers.entity.hasOwnProperty("generation") && that.answers.entity.generation.migrations == false)
        return // пропускаем если у элемента есть указание не создавать

    const dataToRender = sql.prepareData(that.answers.entity)
    const migrationsSubdir = that.options.calledFromApp ? 'database/Migrations/' : 'Migrations/'
    const files = fs.readdirSync(process.cwd() + '/' + migrationsSubdir)
    files.sort().reverse()
    const newMigrationNumber = pad(files.length > 0 ? Number(files[0].split('_')[0]) + 1 : 0, 4)


    that.fs.copyTpl(
        that.templatePath("Migrations/_000N_DESC.sql"),
        that.destinationPath(migrationsSubdir+`${newMigrationNumber}_${dataToRender.name}.sql`),
        dataToRender
    );

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
        this.log('Migrations generator...');

    }

    writing() {
        copyDbFiles(this);
    }

    install() {
    }
}