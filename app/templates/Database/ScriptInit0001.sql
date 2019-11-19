USE [$<%= package.toUpperCase() %>_DB_NAME]
GO

<% messageList.forEach(function(msg){ -%>
<%=    `CREATE TABLE [${msg.name}] (` %>
<%     msg.propList.forEach(function(prop){ -%>
<%=        `    [${prop.name}] ${prop.type}${prop.optionList},` %>
<%     }); -%>
<%=    ")" %>
<%=    "GO" %>
<% }); %>