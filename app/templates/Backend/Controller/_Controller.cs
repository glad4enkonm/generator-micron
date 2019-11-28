using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;

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
        public ActionResult<IEnumerable<<%= service.name %>>> Get<%= service.name %>()
        {
            return ExecuteLoagAndReturnStatus(() => _<%= package %>Client.Get<%= service.name %>().Result, _logger, "Get<%= service.name %>", this);
        }
<%     } else if (protoService.method.startsWith("Create")) { -%>
        [HttpPost("<%= service.name %>")]
        public ActionResult Create<%= service.name %>(<%= service.name %> <%= protoService.nameCamelCase %>)
        {
            async void action()
            {
                <%= protoService.nameCamelCase %>.ValidateAndThrow();
                await _<%= package %>Client.Create<%= service.name %>(<%= protoService.nameCamelCase %>);
            }
            return ExecuteLoagAndReturnStatus(action, _logger, "Add<%= service.name %>", this);
        }
<%     } else if (protoService.method.startsWith("Update")) { -%>
        [HttpPut("<%= service.name %>")]
        public ActionResult Update<%= service.name %>(<%= service.name %> <%= protoService.nameCamelCase %>)
        {
            async void action()
            {
                <%= protoService.nameCamelCase %>.ValidateAndThrow();
                await _<%= package %>Client.Update<%= service.name %>(<%= protoService.nameCamelCase %>);
            }
            return ExecuteLoagAndReturnStatus(action, _logger, "Update<%= service.name %>", this);
        }
<%     } else if (protoService.method.startsWith("Delete")) { -%>
        [HttpDelete("<%= service.name %>")]
        public ActionResult Delete<%= service.name %>(<%= service.name %> <%= protoService.nameCamelCase %>)
        {
            async void action()
            {
                await _<%= package %>Client.Delete<%= service.name %>(<%= protoService.nameCamelCase %>);
            }
            return ExecuteLoagAndReturnStatus(action, _logger, "Delete<%= service.name %>", this);
        }
<%     } -%>

<%   }); -%>
#endregion
<% }); -%>
    }

}
