const _ = require('lodash');
const namingHelper = require('../helper/naming');

const mapping = {
    "string"        :       "string",
    "int32"         :       "int",
    "string unique" :       "string"
}

const mapType = prop => mapping[prop];

function prepareData(data, cache) {
    const cloneData = _.cloneDeep(data);

    cloneData.packagePascalCase = namingHelper.casePascal(cloneData.package);
    cloneData.serverName = cloneData.packagePascalCase + "Server";
    cloneData.serviceLogic = cloneData.packagePascalCase + "ServiceLogic";
    cloneData.serviceLogicInstance = `_${cloneData.package}ServiceLogic`;

    cloneData.serviceList = _.cloneDeep(cache.protoDataToRender.serviceList);
    const messageExceptRequestResponse =  
        cache.protoDataToRender.messageList.filter(msg => !msg.isRequest && !msg.isResponse);
    cloneData.messageList = _.cloneDeep(messageExceptRequestResponse);
    cloneData.messageList = cloneData.messageList.map(msg => {
        msg.propList.map(prop => {
            prop.formatedName = namingHelper.casePascal(prop.formatedName);
            prop.type = mapType(prop.type);
        });                
        return {...msg, packagePascalCase: cloneData.packagePascalCase}
    });
    return cloneData;
}

module.exports = {
    prepareData
}