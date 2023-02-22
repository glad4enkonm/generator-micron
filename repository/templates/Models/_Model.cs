using Dapper.Contrib.Extensions;
<%    if (!generation.isHistoryEnabled) { -%>

namespace database.Models;

[Table("<%- name %>")]
public class <%- name %>: <%- name.endsWith("History") ? "HistoryBase" : "IEntity" %>
<%    } else { -%>
using database.Models.History.Base;

namespace database.Models.History;

[Table("<%- name %>")]
public class <%- name %>: HistoryBase
<%    } -%>
{
<% (name.endsWith("History") ? [...modelProps.filter(prop => prop.name === name + "Id")] : modelProps).forEach(function(prop){ -%>
<%    if (prop.name === name + "Id") { -%>
    [Key]
<%    } -%>
    public <%= prop.type %> <%= prop.name %> { get; set; }
<% }); -%>
    public ulong GetId ()
    {
        return <%- name %>Id;
    }
}