using backend.Authorization;
using backend.Helpers;
using database.Models;
using database.Repository;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
public class <%- entities[0].generation.controller %>Controller: ControllerBase
{
    private readonly ILogger<UserController> _logger;
<%  entities.forEach(function(entity){ -%>
    private readonly IRepository<%- entity.name %> _repository<%- entity.name %>;
<%  }); -%>

    public <%- entities[0].generation.controller %>Controller(ILogger<UserController> logger
<%  entities.forEach(function(entity){ -%>
        ,IRepository<%- entity.name %> repository<%- entity.name %>
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
<%    if (entity.controller.operations.includes("C")) { -%>
    [HttpPost("<%= entity.name %>")]
    public long Create<%= entity.name %>(<%= entity.name %> entity)
    {
        return _repository<%- entity.name %>.Insert(entity);
    }

<%    } -%>
<%    if (entity.controller.operations.includes("R")) { -%>
    [HttpGet("<%= entity.name %>")]
    public <%= entity.name %>? Get<%= entity.name %>(long id)
    {
        return _repository<%- entity.name %>.Get(id);
    }

    [HttpGet("<%= entity.name %>/list")]
    public IList<<%= entity.name %>> Get<%= entity.name %>List()
    {
        return _repository<%- entity.name %>.GetAll().ToList();
    }

<%    } -%>
<%    if (entity.controller.operations.includes("U")) { -%>
    [HttpPatch("<%= entity.name %>")]
    public <%= entity.name %> Update<%= entity.name %>(KeyValuePair<string, string>[] patch)
    {
        long id = Convert.ToInt64(patchUser.First(pair => pair.Key == "<%= entity.name %>Id").Value);
        var previousState =
            _repository<%- entity.name %>.Get(id) ?? throw new InvalidOperationException();
        var allowedPropsToUpdate = new[] {};
        var updatedState = Diff.ApplyAllowedDiff(previousState, patch, allowedPropsToUpdate) as <%= entity.name %>;
        _repository<%- entity.name %>.Update(updatedState ?? throw new InvalidOperationException());
        return updatedState;
    }

<%    } -%>
<%    if (entity.controller.operations.includes("D")) { -%>
    [HttpDelete("<%= entity.name %>")]
    public <%= entity.name %>? Delete<%= entity.name %>(long id)
    {
        var entity = _repository<%- entity.name %>.Get(id) ?? throw new InvalidOperationException();
        return _repository<%- entity.name %>.Delete(entity);
    }
<%    } -%>

#endregion

<% }); -%>
}