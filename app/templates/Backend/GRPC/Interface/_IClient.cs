using Broadcast.<%= packagePascalCase %>;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.GRPC.Interface
{
    public interface I<%= packagePascalCase %>Client
    {

<% serviceList.forEach(function(service){ -%>
#region <%= service.name + service.operation %>
<%   service.protoServiceList.forEach(function(protoService){ -%>
<%     if (protoService.method.startsWith("Get")) { -%>
        Task<List<<%= service.name %>>> Get<%= service.name%>List();
<%     } else if (protoService.method.startsWith("Create")) { -%>
        Task Create<%= service.name %>(<%= service.name %> instance);
<%     } else if (protoService.method.startsWith("Update")) { -%>
        Task Create<%= service.name %>(<%= service.name %> instance);
<%     } else if (protoService.method.startsWith("Delete")) { -%>
        Task Delete<%= service.name %>(<%= service.name %> instance);
<%     } -%>
<%   }); -%>
#endregion
<% }); -%>
    }
}
