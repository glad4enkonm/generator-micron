const appendHistoryEntities = (that) => {
    const entitiesWithHistoryEnabled = that.answers.entities.filter(entity => entity.generation.isHistoryEnabled == true)
    const createdHistoryEntities = entitiesWithHistoryEnabled.map(entity => Object.assign({}, {
        "name": entity.name + "History",
        "generation": {
            "migrations": true,
            "repository": true,
            "controller": false,
            "store": false
        },
        "controller": {
            "operations": "CR"
        },
        "props": [
            {"name": "Changed", "type": "datetime", "unique": false, "default": "CURRENT_TIMESTAMP", "null": false},
            {"name": "Difference", "type": "varchar(1000)", "unique": false, "default": "", "null": false}
        ],
        "init": [],
        "relations": [
            {"prop": "", "table": entity.name},
            {"prop": "ChangedBy", "table": "User"}
        ]
    }))

    that.answers.entities = [...that.answers.entities, ...createdHistoryEntities]
}

module.exports = {
    appendHistoryEntities
}