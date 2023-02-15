const _ = require('lodash');

const casePascal = string => _.upperFirst(_.camelCase(string))

const pad = (num, size) => {
    num = num.toString()
    while (num.length < size) num = "0" + num
    return num
}

const firstLetterToLowerCase = str => str.charAt(0).toLowerCase() + str.slice(1)

module.exports = {
    casePascal,
    pad,
    firstLetterToLowerCase
}