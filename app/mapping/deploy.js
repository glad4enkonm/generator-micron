const _ = require('lodash');
const namingHelper = require('../helper/naming');


function prepareData(data, cache) {
    const cloneData = _.cloneDeep(data);

    cloneData.packageUpperCase = cloneData.package.toUpperCase();    
    cloneData.packagePascalCase = namingHelper.casePascal(cloneData.package);
    
    return cloneData;
}

module.exports = {
    prepareData
}