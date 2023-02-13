const _ = require('lodash');
const {casePascal} = require("./naming");

const mapping = {
    "bigint unsigned": "ulong",
    "bigint": "long",
    "int unsigned": "uint",
    "int": "int",
    "mediumint unsigned": "uint",
    "mediumint": "int",
    "smallint unsigned": "ushort",
    "smallint": "short",
    "tinyint unsigned": "byte",
    "tinyint": "sbyte",
    "datetime": "DateTime",
    "varchar": "string",
    "decimal": "decimal",
}

function prepare_controller_data(entity) {
    console.log("prepare_controller_data")
    const entityCopy = _.cloneDeep(entity)
    /*
    return entityCopy
    entityCopy.modelProps = []
    // Проходим по всем свойствам из SQL и отображаем типы
    for (let [index, prop] of entityCopy.props.entries()) {
        let newProp = {...prop}
        newProp["type"] = mapType(prop.type)
        entityCopy.modelProps.push(newProp)
    } */
    console.log("prepare_controller_data done")
    return entityCopy
}

const mapType = sqlPropType => {
    for (let sqlTypePrefix in mapping) {
        if (Object.prototype.hasOwnProperty.call(mapping, sqlTypePrefix)
            && sqlPropType.startsWith(sqlTypePrefix.toLowerCase()))
                return mapping[sqlTypePrefix]
    }
}

module.exports = {
    prepareData: entity => prepare_controller_data(entity)
}