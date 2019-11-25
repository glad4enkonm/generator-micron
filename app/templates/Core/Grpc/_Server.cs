
using System.Threading;
using System.Threading.Tasks;
using Broadcast.<%= packagePascalCase %>;
using Grpc.Core;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using <%= packagePascalCase %>.Business.Interface;
using <%= packagePascalCase %>.Helper;
using static Broadcast.<%= packagePascalCase %>.Service;

namespace Core.Grpc
{
    public class <%= serverName %> : ServiceBase, IHostedService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<<%= serverName %>> _logger;
        private readonly I<%= serviceLogic %> <%= serviceLogicInstance %>;

        private Server _serverInstance;

        public <%= packagePascalCase %>Server(IConfiguration configuration, ILogger<UserServer> logger, I<%= serviceLogic %> <%= package %>ServiceLogic)
        {
            _configuration = configuration;
            _logger = logger;
            <%= serviceLogicInstance %> = <%= package %>ServiceLogic;
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
            <%= protoService.result %> result = <%= serviceLogicInstance %>.<%= protoService.method %>(request);
            return result;
<%        } else { -%>
            <%= serviceLogicInstance %>.<%= protoService.method %>(request);
            return new Empty();
<%        } -%>            
        }

<%     }); -%>
#endregion
<% }); -%>

    }
}