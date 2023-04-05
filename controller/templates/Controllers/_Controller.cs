using backend.Authorization;
using backend.Helpers;
using database.Models;
using database.Repository;
using database.Models.History;
using database.Repository.History;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
public class <%- entities[0].generation.controller %>Controller: ControllerBase
{
    private readonly ILogger<UserController> _logger;
<%  entities.forEach(function(entity){ -%>
    private readonly I<%- entity.name %>Repository _repository<%- entity.name %>;
<%  }); -%>

    public <%- entities[0].generation.controller %>Controller(ILogger<UserController> logger
<%  entities.forEach(function(entity){ -%>
        ,I<%- entity.name %>Repository repository<%- entity.name %>
<%  }); -%>
    )
    {
        _logger = logger;
<% entities.forEach(function(entity){ -%>
        _repository<%- entity.name %> = repository<%- entity.name %>;
<% }); -%>
    }

<% entities.forEach(function(entity){ -%>
#region <%= entity.name %> <%= entity.controller.operations %>
<%    if (entity.controller.operations.includes("C") && entity.generation.isHistoryEnabled) { -%>
    [HttpPost("<%= entity.name %>")]
    public ulong Create<%= entity.name %>(<%= entity.name %> entity)
    {
        var userId = (ulong)(HttpContext.Items["UserId"] ?? throw new InvalidOperationException());
        return _repository<%- entity.name %>.Insert(entity, userId);
    }

<%    } else if (entity.controller.operations.includes("C")) {-%>
    [HttpPost("<%= entity.name %>")]
    public ulong Create<%= entity.name %>(<%= entity.name %> entity)
    {
        return _repository<%- entity.name %>.Insert(entity);
    }

<%    } -%>
<%    if (entity.controller.operations.includes("R")) { -%>
    [HttpGet("<%= entity.name %>/{id}")]
    public <%= entity.name %>? Get<%= entity.name %>(ulong id)
    {
        return _repository<%- entity.name %>.Get(id);
    }

    [HttpGet("<%= entity.name %>/list")]
    public IList<<%= entity.name %>> Get<%= entity.name %>List()
    {
        return _repository<%- entity.name %>.GetAll().ToList();
    }

<%    } -%>
<%    if (entity.controller.operations.includes("U") && entity.generation.isHistoryEnabled) { -%>
    [HttpPatch("<%= entity.name %>")]
    public <%= entity.name %> Update<%= entity.name %>(KeyValuePair<string, string>[] patch)
    {
        var userId = (ulong)(HttpContext.Items["UserId"] ?? throw new InvalidOperationException());
        ulong id = Convert.ToUInt64(patch.First(pair => pair.Key == "<%= entity.name %>Id").Value);
        var previousState =
            _repository<%- entity.name %>.Get(id) ?? throw new InvalidOperationException();
        var allowedPropsToUpdate = new[] {}; // TODO: заполнить свойства <% entity.props.forEach(function(prop){ -%>"<%- prop.name %>",<%  }); -%>

        var updatedState = Diff.ApplyAllowedDiff(previousState, patch, allowedPropsToUpdate) as <%= entity.name %>;
        _repository<%- entity.name %>.Update(updatedState ?? throw new InvalidOperationException(), userId, patch);
        return updatedState;
    }

<%    } else if (entity.controller.operations.includes("U")) {-%>
    [HttpPatch("<%= entity.name %>")]
    public <%= entity.name %> Update<%= entity.name %>(KeyValuePair<string, string>[] patch)
    {
        ulong id = Convert.ToUInt64(patch.First(pair => pair.Key == "<%= entity.name %>Id").Value);
        var previousState =
            _repository<%- entity.name %>.Get(id) ?? throw new InvalidOperationException();
        var allowedPropsToUpdate = new[] {}; // TODO: заполнить свойства <% entity.props.forEach(function(prop){ -%>"<%- prop.name %>",<%  }); -%>

        var updatedState = Diff.ApplyAllowedDiff(previousState, patch, allowedPropsToUpdate) as <%= entity.name %>;
        _repository<%- entity.name %>.Update(updatedState ?? throw new InvalidOperationException());
        return updatedState;
    }

<%    } -%>
<%    if (entity.controller.operations.includes("D") && entity.generation.isHistoryEnabled) { -%>
    [HttpDelete("<%= entity.name %>/{id}")]
    public bool Delete<%= entity.name %>(ulong id)
    {
        var userId = (ulong)(HttpContext.Items["UserId"] ?? throw new InvalidOperationException());
        var entity = _repository<%- entity.name %>.Get(id) ?? throw new InvalidOperationException();
        return _repository<%- entity.name %>.Delete(entity, userId);
    }
<%    } else if (entity.controller.operations.includes("D")) {-%>
    [HttpDelete("<%= entity.name %>")]
    public bool Delete<%= entity.name %>(ulong id)
    {
        var entity = _repository<%- entity.name %>.Get(id) ?? throw new InvalidOperationException();
        return _repository<%- entity.name %>.Delete(entity);
    }
<%    } -%>

#endregion

<% }); -%>
}