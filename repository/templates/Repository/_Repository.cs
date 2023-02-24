using database.Repository.Base;
<%    if (!name.endsWith("History") && !generation.isHistoryEnabled) { -%>
using database.Models;

namespace database.Repository;

public interface I<%- name %>Repository : IDataRepository<<%- name %>>
{
}

public class <%- name %>Repository : DataRepositoryBase<<%- name %>>, I<%- name %>Repository
{
}
<%    } else if (name.endsWith("History")) { -%>
using database.Models.History;

namespace database.Repository.History;

public interface I<%- name %>Repository : IDataRepository<<%- name %>>
{
}

public class <%- name %>Repository : DataRepositoryBase<<%- name %>>, I<%- name %>Repository
{
}
<%    } else if (generation.isHistoryEnabled) { -%>
using database.Models.History;

namespace database.Repository.History;

public interface I<%- name %>Repository : IDataRepositoryWithHistory<<%- name %>>
{
}

public class <%- name %>Repository :
    DataRepositoryWithHistoryBase<<%- name %>, <%- name %>History>, I<%- name %>Repository
{
}

<%    } -%>
