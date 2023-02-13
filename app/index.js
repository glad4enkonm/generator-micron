const Generator = require("yeoman-generator");


module.exports = class extends Generator {
    pkg;
    initializing() {
        this.composeWith(require.resolve('../migrations'), [], {calledFromApp: true})
        this.composeWith(require.resolve('../repository'), [], {calledFromApp: true})

        const config = this.config.getAll()
        this.answers = {...config.promptValues, entity: config.entity}
    }

    async prompting() {

    }

    writing() {
    }

    install() {
    }
}