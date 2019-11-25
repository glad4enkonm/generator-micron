const _ = require('lodash');
const namingHelper = require('../helper/naming');

const mapping = {
    "string"        :       "[varchar](max)",
    "int32"         :       "[int]",
    "string unique" :       "[varchar](450)" // https://stackoverflow.com/questions/2863993
}

let allStructureIdNameSet = null,
    allRelationList = null;

function addRelationList(existing) {
  allRelationList.forEach(relation => {
    const tableName = namingHelper.casePascal(relation.from + ' to ' + relation.to);
    existing.push( 
      processStructure({
        name: tableName,
        propList: [
          { name:  tableName + "Id", type: "int32" },
          { name:  namingHelper.casePascal(relation.from + " id"), type: "int32", notNull: true },
          { name:  namingHelper.casePascal(relation.to + " id"), type: "int32", notNull: true },
        ],
        isRelation: true
      })
    );
  });
}

function processProperty(prop, structureName) {
  prop.name = namingHelper.casePascal(prop.name);
  
  if (prop.type == "string" && prop.hasOwnProperty("unique"))
    prop.type = "string unique";
  
  prop.type = mapType(prop.type);

  const isIdProp = prop.name == `${structureName}Id`;
  if (isIdProp) {
    prop.optionList = " IDENTITY(1,1) NOT NULL PRIMARY KEY";
    return prop;
  }
  prop.optionList = prop.hasOwnProperty("notNull") ? " NOT NULL" : " NULL";
  prop.optionList += prop.hasOwnProperty("unique") ? " UNIQUE" : "";
  const matchStructureName = prop.name.replace(/Id$/, '');
  if (allStructureIdNameSet.has(matchStructureName)) {
    prop.optionList += ` FOREIGN KEY REFERENCES [${matchStructureName}]([${prop.name}])`;
    if (prop.hasOwnProperty("fromRelation"))
      prop.optionList += ' ON DELETE CASCADE';
  }
  return prop;
}

function processStructure(structure) {
  structure.name = namingHelper.casePascal(structure.name);
  const structIsRelation = structure.hasOwnProperty("isRelation");
  if (!structIsRelation && structure.relationList) { 
    // not a relation structure and has relation list
    structure.relationList.forEach(relation => {
      allRelationList.push({from:structure.name, to:relation});
    });
  }

  structure.propList.map(prop => {
    if (structIsRelation)
      prop.fromRelation = true;
    processProperty( prop, structure.name);
  });
  return structure;
};

function prepare_sql_data(data) {
    const cloneData = _.cloneDeep(data);
    allStructureIdNameSet = new Set(cloneData.messageList.map(struct => namingHelper.casePascal(struct.name)));
    
    allRelationList = [];
    cloneData.messageList = cloneData.messageList.map(processStructure);
    addRelationList(cloneData.messageList);
    return cloneData;
  }

const mapType = prop => mapping[prop];

module.exports = {
    prepareData: data => prepare_sql_data(data)
}