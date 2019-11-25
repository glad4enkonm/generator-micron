const _ = require('lodash');
const namingHelper = require('../helper/naming');

function prepareData(data, cache) {
    const cloneData = _.cloneDeep(data);

    cloneData.packagePascalCase = namingHelper.casePascal(cloneData.package);
    cloneData.serverName = cloneData.packagePascalCase + "Server";
    cloneData.serviceLogic = cloneData.packagePascalCase + "ServiceLogic";
    cloneData.serviceLogicInstance = `_${cloneData.package}ServiceLogic`;

    cloneData.serviceList = _.cloneDeep(cache.protoDataToRender.serviceList);

    return cloneData;
}

module.exports = {
    prepareData
}