using Broadcast.<%= packagePascalCase %>;

namespace <%= packagePascalCase %>.Business.Interface
{
    public interface I<%= packagePascalCase %>ServerLogic
    {
        
<% serviceList.forEach(function(service){ -%>
#region <%= service.name + service.operation %>
<%   service.protoServiceList.forEach(function(protoService){ -%>
<%     if (protoService.result != "Empty") { -%>
            <%= protoService.result %> <%= protoService.method %>(<%=protoService.param%> request);
<%     } else { -%>
<%       if (protoService.param != "Empty") { -%>
            void <%= protoService.method %>(<%=protoService.param %> request);
<%       } else { -%>
            void <%= protoService.method %>();
<%       } -%>
<%     } -%>
<%   }); -%>
#endregion

<% }); -%>
    }
}
