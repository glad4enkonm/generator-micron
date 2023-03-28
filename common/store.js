const _ = require('lodash');
const {firstLetterToLowerCase} = require("./naming");

const mapping = {
    "bigint unsigned": "bigint",
    "bigint": "bigint",
    "int unsigned": "number",
    "int": "number",
    "mediumint unsigned": "number",
    "mediumint": "number",
    "smallint unsigned": "number",
    "smallint": "number",
    "tinyint unsigned": "number",
    "tinyint": "number",
    "datetime": "Date",
    "varchar": "string",
    "decimal": "number",
    "bool": "boolean"
}

function prepare_store_model_api_data(entity) {
    console.log("prepare_store_model_api_data")
    const entityCopy = _.cloneDeep(entity)
    entityCopy.modelFrontProps = []
    entityCopy.camelName = firstLetterToLowerCase(entityCopy.name)
    // Проходим по всем свойствам из SQL и отображаем типы
    for (let [index, prop] of entityCopy.props.entries()) {
        let newProp = {...prop}
        newProp["type"] = mapType(prop.type)
        newProp["camelName"] = firstLetterToLowerCase(prop.name)
        entityCopy.modelFrontProps.push(newProp)
    }
    console.log("prepare_store_model_api_data done")
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
    prepareData: entity => prepare_store_model_api_data(entity)
}