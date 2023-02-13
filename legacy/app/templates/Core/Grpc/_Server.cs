
using System.Threading;
using System.Threading.Tasks;
using Broadcast.<%= packagePascalCase %>;
using Grpc.Core;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Core.Business.Interface;
using Core.Helper;
using static Broadcast.<%= packagePascalCase %>.Service;

namespace Core.Grpc
{
    public class <%= serverName %> : ServiceBase, IHostedService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<<%= serverName %>> _logger;
        private readonly I<%= serverLogic %> <%= serverLogicInstance %>;

        private Server _serverInstance;

        public <%= packagePascalCase %>Server(IConfiguration configuration, ILogger<<%= packagePascalCase %>Server> logger, 
            I<%= serverLogic %> <%= package %>serverLogic)
        {
            _configuration = configuration;
            _logger = logger;
            <%= serverLogicInstance %> = <%= package %>serverLogic;
        }        

        public Task StartAsync(CancellationToken cancellationToken)
        {
            var config = _configuration.GetGrpcConfigObject("<%= packagePascalCase %>");

            _serverInstance = new Server
            {
                Ports = {new ServerPort(config.HostName, config.Port, ServerCredentials.Insecure)},
                Services = {BindService(this)}
            };
            _serverInstance.Start();
            _logger.LogInformation($"gRPC service started on {config.HostName}:{config.Port}");


            return Task.CompletedTask;
        }
        
        public Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("stopping gRPC <%= packagePascalCase %>Server ...");
            return _serverInstance.ShutdownAsync();
        }

<% serviceList.forEach(function(service){ -%>

#region <%= service.name + service.operation %>
<%     service.protoServiceList.forEach(function(protoService){ -%>
        public override async Task<<%=protoService.result%>> <%=protoService.method%>(<%=protoService.param%> request, ServerCallContext context)
        {
<%        if (protoService.result != "Empty") { -%>
            <%= protoService.result %> result = <%= serverLogicInstance %>.<%= protoService.method %>(request);
            return result;
<%        } else { -%>
            <%= serverLogicInstance %>.<%= protoService.method %>(request);
            return new Empty();
<%        } -%>            
        }

<%     }); -%>
#endregion
<% }); -%>

    }
}