using <%= rootNamespace %>.GRPC.Interface;
using <%= rootNamespace %>.Helper;
using Broadcast.<%= packagePascalCase %>;

using Grpc.Core;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using static <%= rootNamespace %>.Helper.GrpcHelper;



namespace <%= rootNamespace %>.GRPC
{
    public class <%= packagePascalCase %>Client: I<%= packagePascalCase %>Client
    {
        private readonly Broadcast.<%= packagePascalCase %>.Service.ServiceClient Client;
        private readonly ILogger<<%= packagePascalCase %>Client> Logger;

        public <%= packagePascalCase %>Client(IConfiguration config, ILogger<<%= packagePascalCase %>Client> logger)
        {
            var thisConfig = config.GetGRPCConfigObject("<%= packagePascalCase %>");
            var channel = new Channel($"{thisConfig.HostName}:{thisConfig.Port}", ChannelCredentials.Insecure);
            this.Client = new Broadcast.<%= packagePascalCase %>.Service.ServiceClient(channel);
            this.Logger = logger;
        }        

<% serviceList.forEach(function(service){ -%>
#region <%= service.name + service.operation %>
<%   service.protoServiceList.forEach(function(protoService){ -%>
<%     if (protoService.method.startsWith("Get") && !service.getByInstance) { -%>
        public async Task<IEnumerable<<%= service.name %>>> Get<%= service.name %>Async()
        {
            <%= service.name %>Response response = await Client.Get<%= service.name %>Async(new Empty());
            return response.<%= service.name %>List;
        }
<%     } else if (protoService.method.startsWith("Get") && service.getByInstance) { -%>
        public async Task<IEnumerable<<%= service.name %>>> Get<%= service.name %>Async(<%= service.name %> instance)
        {
            <%= service.name %>Response response = await Client.Get<%= service.name %>Async(new <%= service.name %>Request { <%= service.name %> = instance });
            return response.<%= service.name %>List;
        }
<%     } else if (protoService.method.startsWith("Create")) { -%>
<%       if (returnIntegerId) { -%>
        public async Task<Integer> Create<%= service.name %>Async(<%= service.name %> instance) =>
<%       } else { -%>
        public async Task Create<%= service.name %>Async(<%= service.name %> instance) =>
<%       } -%>
            await Client.Create<%= service.name %>Async(new <%= service.name %>Request { <%= service.name %> = instance });
<%     } else if (protoService.method.startsWith("Update")) { -%>
        public async Task Update<%= service.name %>Async(<%= service.name %> instance) =>
            await Client.Update<%= service.name %>Async(new <%= service.name %>Request { <%= service.name %> = instance });
<%     } else if (protoService.method.startsWith("Delete")) { -%>
        public async Task Delete<%= service.name %>Async(<%= service.name %> instance) =>
            await Client.Delete<%= service.name %>Async(new <%= service.name %>Request { <%= service.name %> = instance });
<%     } -%>

<%   }); -%>
#endregion

<% }); -%>       
    }

}
