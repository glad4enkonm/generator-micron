using Broadcast.<%= packagePascalCase %>;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace <%= rootNamespace %>.GRPC.Interface
{
    public interface I<%= packagePascalCase %>Client
    {

<% serviceList.forEach(function(service){ -%>
#       region <%= service.name + service.operation %>
<%   service.protoServiceList.forEach(function(protoService){ -%>
<%     if (protoService.method.startsWith("Get") && !service.getByInstance) { -%>
        Task<IEnumerable<<%= service.name %>>> Get<%= service.name%>Async();
<%     } else if (protoService.method.startsWith("Get") && service.getByInstance) { -%>
        Task<IEnumerable<<%= service.name %>>> Get<%= service.name%>Async(<%= service.name %> instance);
<%     } else if (protoService.method.startsWith("Create")) { -%>
<%       if (returnIntegerId) { -%>
        Task<Integer> Create<%= service.name %>Async(<%= service.name %> instance);
<%       } else { -%>
        Task Create<%= service.name %>Async(<%= service.name %> instance);
<%       } -%>
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
