const _ = require('lodash');
const {casePascal} = require("./naming");

const id = {
    type: "bigint unsigned",
    options: "auto_increment NOT NULL PRIMARY KEY,",
}

initTemplate = "INSERT INTO [Table] ([Props]) VALUES([Values]);"


function prepare_init_sql(entity){
    for (let [index, init] of entity.init.entries()) {
        let propsStr = "", propsValues = ""
        for (let prop in init) {
            if (Object.prototype.hasOwnProperty.call(init, prop)) {
                propsStr += propsStr.length == 0 ? `\`${casePascal(prop)}\`` : `, \`${casePascal(prop)}\``
                propsValues += propsValues.length == 0 ? `'${init[prop]}'` : `, '${init[prop]}'`
            }
        }
        init.props = propsStr
        init.values = propsValues
    }
}

function prepare_relation_sql(entity){
    entity.constraints = []
    for (let [index, relation] of entity.relations.entries()) {
        relation.table = casePascal(relation.table)
        const defaultPropName = casePascal(relation.table) + 'Id'
        const propName = relation.prop.length > 0 ? relation.prop : defaultPropName
        entity.props.push({"name": propName, "type": id.type})
        entity.constraints.push({"name": `FK_${entity.name}_${propName}_${defaultPropName}`,
            "prop": propName,  "foreignProp": defaultPropName, "table": relation.table })
    }
}

function prepare_sql_data(entity) {
    console.log("prepare_sql_data")
    const entityCopy = _.cloneDeep(entity)
    entityCopy.name = casePascal(entityCopy.name) // преобразуем название

    // Преобразуем названия всех свойств
    entityCopy.props.unshift({"name":entityCopy.name + 'Id', "id": true, "type": id.type, "options" : id.options})

    // Обрабатываем отношения
    prepare_relation_sql(entityCopy)

    // Проходим по всем свойствам
    for (let [index, prop] of entityCopy.props.entries()) {
        console.log(JSON.stringify(prop))
        prop.name =  casePascal(prop.name)
        if (prop.hasOwnProperty("id") && prop["id"]) // options заполнены для id уже
            continue;
        if (prop.hasOwnProperty("null") && prop["null"])
            prop["options"] = "NULL"
        else
            prop["options"] = "NOT NULL"
        if (prop.hasOwnProperty("unique") && prop["unique"])
            prop["options"] += " UNIQUE"
        if (prop.hasOwnProperty("default") && prop["default"].length > 0)
            prop["options"] += " DEFAULT " + prop["default"]
        if (index != entityCopy.props.length -1)
            prop["options"] += ","
    }
    prepare_init_sql(entityCopy)

    console.log("prepare_sql_data done")
    return entityCopy
  }

module.exports = {
    prepareData: entity => prepare_sql_data(entity)
}