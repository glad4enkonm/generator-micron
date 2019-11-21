const _ = require('lodash');
const namingHelper = require('../helper/naming');

const crudNamingPattern = {
    "C": function(name, request, response) {
        return `rpc Create${name}(${request}) returns (Empty) {}`;
    },
    "R": function(name, request, response) {
        return `rpc Get${name}(Empty) returns (Empty) {${response}}`;
    },
    "U": function(name, request, response) {
        return `rpc Update${name}(${request}) returns (Empty) {}`;
    },
    "D": function(name, request, response) {
        return `rpc Delete${name}(${request}) returns (Empty) {}`;
    },
};



function processServiceStructure(structure) {
    protoServiceList = [];
    for (key in crudNamingPattern) {
        if (structure.operation.includes(key))
            protoServiceList.push(crudNamingPattern[key](structure.name, structure.request, structure.response))
    }
    structure.protoServiceList = protoServiceList;
    return structure;
}


function prepareProtoData(data) {
    const clone_data = _.cloneDeep(data);
    
    clone_data.packagePascalCase = namingHelper.casePascal(clone_data.package);    
    clone_data.serviceList = clone_data.serviceList.map(processServiceStructure);
    
    return clone_data;
}

module.exports = {
    prepareData: data => prepareProtoData(data)
}