using Broadcast.<%= packagePascalCase %>;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.GRPC.Interface
{
    public interface I<%= packagePascalCase %>Client
    {

<% serviceList.forEach(function(service){ -%>
#       region <%= service.name + service.operation %>
<%   service.protoServiceList.forEach(function(protoService){ -%>
<%     if (protoService.method.startsWith("Get")) { -%>
        Task<IEnumerable<<%= service.name %>>> Get<%= service.name%>Async();
<%     } else if (protoService.method.startsWith("Create")) { -%>
        Task Create<%= service.name %>Async(<%= service.name %> instance);
<%     } else if (protoService.method.startsWith("Update")) { -%>
        Task Update<%= service.name %>Async(<%= service.name %> instance);
<%     } else if (protoService.method.startsWith("Delete")) { -%>
        Task Delete<%= service.name %>Async(<%= service.name %> instance);
<%     } %>
<%   }); -%>
        #endregion

<% }); -%>
    }
}
