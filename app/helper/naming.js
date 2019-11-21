const _ = require('lodash');

const casePascal = string => _.upperFirst(_.camelCase(string));

module.exports = {
    casePascal
}