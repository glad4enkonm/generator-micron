


<%  entities.filter(e => !e.name.endsWith("History")).forEach(function(entity){ -%>
builder.Services.AddSingleton<I<%- entity.name %>Repository, <%- entity.name %>Repository>();
<%  }); -%>
