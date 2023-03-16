


<%  entities.forEach(function(entity){ -%>
builder.Services.AddScoped<I<%- entity.name %>Repository, <%- entity.name %>Repository>();
<%  }); -%>
