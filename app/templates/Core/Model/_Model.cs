using Dapper.Contrib.Extensions;

namespace <%= packagePascalCase %>.Model
{

    [Table("[<%= namePascal %>]")]
    public class <%= namePascal %>
    {
<% propList.forEach(function(prop){ -%>
<%   if (prop.formatedName === namePascal + "Id") { -%>
        [Key]
<%   } -%>
        public <%= prop.type %> <%= prop.formatedName %> { get; set; }
<% }); -%>
    }
}
