using Dapper.Contrib.Extensions;
<%    if (!generation.isHistoryEnabled && ! name.endsWith("History")) { -%>

namespace database.Models;

[Table("`<%- name %>`")]
public class <%- name %>: IEntity
{
<% modelProps.forEach(function(prop){ -%>
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
<%    } else if (generation.isHistoryEnabled == true) { -%>
using database.Models.History.Base;

namespace database.Models.History;

[Table("`<%- name %>`")]
public class <%- name %>: EntityWithHistoryBase
{
<% modelProps.forEach(function(prop){ -%>
<%    if (prop.name === name + "Id") { -%>
    [Key]
<%    } -%>
<%    if (prop.name === "IsDeleted") { -%>
    public override bool IsDeleted { get; set; }
<%    } else { -%>
    public <%= prop.type %> <%= prop.name %> { get; set; }
<%    } -%>
<% }); -%>
    public override ulong GetId ()
    {
        return <%- name %>Id;
    }
}
<%    } else if (name.endsWith("History")) { -%>
using database.Models.History.Base;

namespace database.Models.History;

[Table("`<%- name %>`")]
public class <%- name %>: HistoryBase
{
    [Key]
    public ulong <%- name %>Id { get; set; }
}
<%    } -%>
