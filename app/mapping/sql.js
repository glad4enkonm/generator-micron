const _ = require('lodash');

const mapping = {
    "string"    :       "[varchar](max)",
    "int32"     :       "[int]", 
}

const pascal_case = string => _.upperFirst(_.camelCase(string));
let allStructureIdNameSet = null,
    allRelationList = null;

function addRelationList(existing) {
  allRelationList.forEach(relation => {
    const tableName = pascal_case(relation.from + ' to ' + relation.to);
    existing.push( 
      processStructure({
        name: tableName,
        propList: [
          { name:  tableName + "Id", type: "int32" },
          { name:  pascal_case(relation.from + " id"), type: "int32", notNull: true },
          { name:  pascal_case(relation.to + " id"), type: "int32", notNull: true },
        ],
        isRelation: true
      })
    );
  });
}

function processProperty(prop, structureName) {
  prop.name = pascal_case(prop.name);
  prop.type = mapType(prop.type);

  const isIdProp = prop.name == `${structureName}Id`;
  if (isIdProp) {
    prop.optionList = " IDENTITY(1,1) NOT NULL PRIMARY KEY";
    return prop;
  }
  prop.optionList = prop.hasOwnProperty("notNull") ? " NOT NULL" : " NULL";
  prop.optionList += prop.hasOwnProperty("unique") ? " UNIQUE" : "";
  const matchStructureName = prop.name.replace(/Id$/, '');
  prop.optionList += allStructureIdNameSet.has(matchStructureName) ? ` FOREIGN KEY REFERENCES [${matchStructureName}]([${prop.name}])` : "";
  return prop;
}

function processStructure(structure) {
  structure.name = pascal_case(structure.name);  
  if (!structure.hasOwnProperty("isRelation") && structure.relationList) { 
    // not a relation structure and has relation list
    structure.relationList.forEach(relation => {
      allRelationList.push({from:structure.name, to:relation});
    });
  }

  structure.propList.map(prop => processProperty(prop, structure.name));
  return structure;
};

function prepare_sql_data(data) {
    const clone_data = _.cloneDeep(data);
    allStructureIdNameSet = new Set(clone_data.messageList.map(struct => pascal_case(struct.name)));
    
    allRelationList = [];
    clone_data.messageList = clone_data.messageList.map(processStructure);
    addRelationList(clone_data.messageList);
    return clone_data;
  }

const mapType = prop => mapping[prop];

module.exports = {
    prepareData: data => prepare_sql_data(data)
}