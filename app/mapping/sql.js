const _ = require('lodash');

const mapping = {
    "string"    :       "[varchar](max)",
    "int32"     :       "[int]", 
}

const pascal_case = string => _.upperFirst(_.camelCase(string));

function prepare_sql_data(data){
    const clone_data = _.cloneDeep(data);
    const allMessageIdNameSet = new Set(clone_data.messageList.map(msg => pascal_case(msg.name)));
    clone_data.messageList = clone_data.messageList
      .map(msg => {
        msg.name = pascal_case(msg.name);
        msg.propList
          .map(prop => {
            prop.name = pascal_case(prop.name);
            prop.type = mapType(prop.type);
  
            const isIdProp = prop.name == `${msg.name}Id`;
            if (isIdProp) {
              prop.optionList = " IDENTITY(1,1) NOT NULL PRIMARY KEY";
              return prop;
            }
            prop.optionList = prop.hasOwnProperty("notNull") ? " NOT NULL" : " NULL";
            prop.optionList += allMessageIdNameSet.has(prop.name) ? ` FOREIGN KEY REFERENCES [${prop.name.replace(/Id$/, '')}]([${prop.name}])` : "";
  
            return prop;
          });
        return msg;
      });
    return clone_data;
  }

const mapType = prop => mapping[prop];

module.exports = {
    prepareData: data => prepare_sql_data(data)
}