const _ = require('lodash');
const namingHelper = require('../helper/naming');
let constructedServiceList = null, allRelationList = null, packagePascalCase = null;

const crudNamingPattern = {
    "C": function(name, request, response) {
        return { method: "Create" + name, param: request, result: "Empty" };
    },
    "R": function(name, request, response, getByInstance) {
        return { method: "Get" + name, param: "Empty", result: response };
    },
    "U": function(name, request, response) {
        return { method: "Update" + name, param: request, result: "Empty" };
    },
    "D": function(name, request, response) {
        return { method: "Delete" + name, param: request, result: "Empty" };
    },
};

function createServiceInstance(name, operation, getByInstance) {
    return { 
        "name": name, 
        "operation" : operation, 
        "request": `${name}Request`, 
        "response": `${name}Response`,
        "getByInstance": getByInstance
    }
}

function addRelationMessage(existing) {
    allRelationList.forEach(relation => {
      const relationName = namingHelper.casePascal(relation.from + ' to ' + relation.to);
      existing.push( 
        processMessageStructure({
          name: relationName,
          propList: [
            { name:  `${relation.from} to ${relation.to} id`, type: "int32" },
            { name:  relation.from + " id", type: "int32"},
            { name:  relation.to + " id", type: "int32"},
          ],
          isRelation: true
        })
      );
    });
  }

function addRequestMessage(existing) { // to do: refactor to use one methor for addRequestMessage, addResponseMessage, ..
    const requestMessageList = existing
        .filter(msg => !msg.isRequest && !msg.isResponse)
        .map(message => {
        return {
            name: namingHelper.casePascal(message.name + ' request'),
             propList: [
                { name:  message.name, type: namingHelper.casePascal(message.name) },                
            ],
            isRequest: true
        };
    });
    existing.push(...requestMessageList.map(processMessageStructure)); //process and append
}

function addResponseMessage(existing) {
    const requestMessageList = existing
        .filter(msg => !msg.isRequest && !msg.isResponse)
        .map(message => {
        return {
            name: namingHelper.casePascal(message.name + ' response'),
             propList: [
                { name:  message.name, type: namingHelper.casePascal(message.name), isRepeated: true },
            ],
            isResponse: true
        };
    });
    existing.push(...requestMessageList.map(processMessageStructure)); //process and append
}
  

function processServiceStructure(structure) {
    protoServiceList = [];
    for (key in crudNamingPattern) {
        if (structure.operation.includes(key)) {
            const service = crudNamingPattern[key](structure.name, structure.request, structure.response);
            service.nameLowerCase = structure.name.toLowerCase();
            service.nameCamelCase = _.camelCase(structure.name);
            if (service.method.startsWith("Get") && structure.getByInstance) {
                service.param = structure.request; // getByInstance = true
            }
            protoServiceList.push(service);
        }            
    }
    structure.protoServiceList = protoServiceList;        
    return structure;
}

function processMessageStructure(structure) {
    let counter = 1;
    structure.namePascal = namingHelper.casePascal(structure.name);
    structure.propList = structure.propList.map(function(prop){
        prop.formatedName = _.snakeCase(prop.name);
        prop.nameCamelCase = _.camelCase(prop.name);
        if (prop.isRepeated) {
            prop.type = "repeated " + prop.type;
            prop.formatedName += "_list";
            prop.formatedNameCamelCase += _.camelCase(prop.formatedName);
        }            
        prop.index = counter++;
        return prop;
    });    

    
    if (!structure.isRequest && !structure.isResponse) { // skip        
        let operation = "";
        if (!structure.hasOwnProperty("operation"))
            operation = structure.isRelation ? "CRD" : "CRUD";
        else
            operation = structure.operation;        
        const constructedService = createServiceInstance(namingHelper.casePascal(structure.name),
            operation, structure.getByInstance == true);
        constructedServiceList.push(constructedService);
    }

    if (structure.relationList) {
        structure.relationList.forEach(relation => {
            allRelationList.push({from:structure.name, to:relation});
        });
    }    
            
    return structure;
}

function messageToValidation(extendedMessage) {
    const result = {
        packagePascalCase: packagePascalCase,
        namePascalCase: extendedMessage.namePascal,
        name: extendedMessage.name,
        nameCamelCase: _.camelCase(extendedMessage.name)
    };

    result.ruleList = extendedMessage.propList
        .filter(prop => prop.hasOwnProperty("notNull") && prop.notNull === true)
        .map(prop => Object.assign({}, {property: namingHelper.casePascal(prop.name)}));
    
    return result;
}

function prepareProtoData(data) {
    const cloneData = _.cloneDeep(data);
    
    if (!cloneData.hasOwnProperty("packagePascalCase"))
        cloneData.packagePascalCase = namingHelper.casePascal(cloneData.package);
    packagePascalCase = cloneData.packagePascalCase;

    constructedServiceList = [];
    allRelationList = [];
    cloneData.messageList = cloneData.messageList.map(processMessageStructure);
    addRelationMessage(cloneData.messageList);
    addRequestMessage(cloneData.messageList);
    addResponseMessage(cloneData.messageList);

    cloneData.serviceList.push(...constructedServiceList);
    cloneData.serviceList = cloneData.serviceList.map(processServiceStructure);

    cloneData.validatorList = cloneData.messageList
        .filter(msg => !msg.isRelation && !msg.isRequest && !msg.isResponse)
        .map(messageToValidation);
    
    return cloneData;
}

module.exports = {
    prepareData: data => prepareProtoData(data)
}