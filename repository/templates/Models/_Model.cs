using Dapper.Contrib.Extensions;
namespace database.Models;

[Table("<%- name %>")]
public class <%- name %>
{
<% modelProps.forEach(function(prop){ -%>
<%    if (prop.name === name + "Id") { -%>
    [Key]
<%    } -%>
    public <%= prop.type %> <%= prop.name %> { get; set; }
<% }); -%>
}