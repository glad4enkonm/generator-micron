USE ${MYSQL_DATABASE};

<%-    `CREATE TABLE \`${name}\` (` %>
<%     constraints.forEach(function(constraint){ -%>
<%-        `    CONSTRAINT ${constraint.name} FOREIGN KEY (${constraint.prop}) REFERENCES \`${constraint.table}\` (${constraint.foreignProp}),` %>
<%     }); -%>
<%     props.forEach(function(prop){ -%>
<%-        `    \`${prop.name}\` ${prop.type} ${prop.options}` %>
<%     }); -%>
<%=    ");" %>

<%     init.forEach(function(init){ -%>
<%-        `INSERT INTO \`${name}\` (${init.props}) VALUES(${init.values});` %>
<%     }); -%>

INSERT INTO Migration (Description) VALUES('${THIS_FILE_NAME}');