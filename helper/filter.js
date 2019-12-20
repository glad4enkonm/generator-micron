function copyTplWithAFilter(source, destination, data) {  
    if (this.answers.filter && source.startsWith(this.templatePath(this.answers.filter)))
        this.fs.copyTpl(source, destination, data);
}
  
function copyWithAFilter(source, destination) {
    if (this.answers.filter && source.startsWith(this.templatePath(this.answers.filter)))
        this.fs.copy(source, destination);
}

module.exports = {
    copyTplWithAFilter,
    copyWithAFilter
}