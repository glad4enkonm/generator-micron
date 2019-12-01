using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Backend.GRPC.Interface;
using Broadcast.<%= packagePascalCase %>;
using Broadcast.<%= packagePascalCase %>.Validation;

using static Backend.Helper.EndpointHelper;

namespace Backend.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class <%= packagePascalCase %>Controller : ControllerBase
    {

        private readonly I<%= packagePascalCase %>Client _<%= package %>Client;
        private readonly ILogger<<%= packagePascalCase %>Controller> _logger;
        public <%= packagePascalCase %>Controller(I<%= packagePascalCase %>Client <%= package %>Client, ILogger<<%= packagePascalCase %>Controller> logger)
        {
            _<%= package %>Client = <%= package %>Client;
            _logger = logger;
        }

<% serviceList.forEach(function(service){ -%>
#region <%= service.name + service.operation %>
<%   service.protoServiceList.forEach(function(protoService){ -%>
<%     if (protoService.method.startsWith("Get")) { -%>
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        [HttpGet("<%= service.name %>")]
        public async Task<ActionResult<IEnumerable<<%= service.name %>>>> Get<%= service.name %>Async()
        {
            return await ExecuteLoagAndReturnStatusAsync(async () => await _<%= package %>Client.Get<%= service.name %>Async(), _logger, "Get<%= service.name %>Async", this);
        }
<%     } else if (protoService.method.startsWith("Create")) { -%>
        [HttpPost("<%= service.name %>")]
        public async Task<ActionResult> Create<%= service.name %>Async(<%= service.name %> <%= protoService.nameCamelCase %>)
        {
            async Task action()
            {
                <%= protoService.nameCamelCase %>.ValidateAndThrow();
                await _<%= package %>Client.Create<%= service.name %>Async(<%= protoService.nameCamelCase %>);
            }
            return await ExecuteLoagAndReturnStatusAsync(action, _logger, "Add<%= service.name %>Async", this);
        }
<%     } else if (protoService.method.startsWith("Update")) { -%>
        [HttpPut("<%= service.name %>")]
        public async Task<ActionResult> Update<%= service.name %>Async(<%= service.name %> <%= protoService.nameCamelCase %>)
        {
            async Task action()
            {
                <%= protoService.nameCamelCase %>.ValidateAndThrow();
                await _<%= package %>Client.Update<%= service.name %>Async(<%= protoService.nameCamelCase %>);
            }
            return await ExecuteLoagAndReturnStatusAsync(action, _logger, "Update<%= service.name %>Async", this);
        }
<%     } else if (protoService.method.startsWith("Delete")) { -%>
        [HttpDelete("<%= service.name %>")]
        public async Task<ActionResult> Delete<%= service.name %>Async(<%= service.name %> <%= protoService.nameCamelCase %>)
        {
            async Task action()
            {
                await _<%= package %>Client.Delete<%= service.name %>Async(<%= protoService.nameCamelCase %>);
            }
            return await ExecuteLoagAndReturnStatusAsync(action, _logger, "Delete<%= service.name %>Async", this);
        }
<%     } -%>

<%   }); -%>
#endregion
<% }); -%>
    }

}
