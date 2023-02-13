function copyTplWithAFilter(source, destination, data) {  
    if (this.answers.filter) {
        if (source.startsWith(this.templatePath(this.answers.filter)))
            this.fs.copyTpl(source, destination, data);
    }
    else {
        this.fs.copyTpl(source, destination, data);
    }
}
  
function copyWithAFilter(source, destination) {
    if (this.answers.filter) {
        if (source.startsWith(this.templatePath(this.answers.filter)))
            this.fs.copy(source, destination);
    } else {
        this.fs.copyTpl(source, destination, data);
    }
}

module.exports = {
    copyTplWithAFilter,
    copyWithAFilter
}