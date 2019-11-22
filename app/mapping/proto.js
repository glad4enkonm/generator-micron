const _ = require('lodash');
const namingHelper = require('../helper/naming');
let constructedServiceList = null, allRelationList = null, packagePascalCase = null;

const crudNamingPattern = {
    "C": function(name, request, response) {
        return `rpc Create${name}(${request}) returns (Empty) {}`;
    },
    "R": function(name, request, response) {
        return `rpc Get${name}(Empty) returns (${response}) {}`;
    },
    "U": function(name, request, response) {
        return `rpc Update${name}(${request}) returns (Empty) {}`;
    },
    "D": function(name, request, response) {
        return `rpc Delete${name}(${request}) returns (Empty) {}`;
    },
};

function createServiceInstance(name, operation) {
    return { "name": name, "operation" : operation, "request": `${name}Request`, "response": `${name}Response`}
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
                { name:  message.name + ' id', type: "int32" },                
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
        if (structure.operation.includes(key))
            protoServiceList.push(crudNamingPattern[key](structure.name, structure.request, structure.response))
    }
    structure.protoServiceList = protoServiceList;        
    return structure;
}

function processMessageStructure(structure) {
    let counter = 1;
    structure.namePascal = namingHelper.casePascal(structure.name);
    structure.propList = structure.propList.map(function(prop){
        prop.formatedName = _.snakeCase(prop.name);
        if (prop.isRepeated) 
            prop.type = "repeated " + prop.type;
        prop.index = counter++;
        return prop;
    });    

    
    if (!structure.isRequest && !structure.isResponse) { // skip
        const operation = structure.isRelation ? "CRD" : "CRUD";
        const constructedService = createServiceInstance(namingHelper.casePascal(structure.name), operation);
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
    return {
        packagePascalCase,
        namePascalCase: extendedMessage.namePascal,
        name: extendedMessage.name
    };
}

function prepareProtoData(data) {
    const cloneData = _.cloneDeep(data);
    
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