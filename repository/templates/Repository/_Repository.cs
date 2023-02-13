using database.Models;
namespace database.Repository;

public interface I<%- name %>Repository : IDataRepository<<%- name %>>
{
}

public class <%- name %>Repository : DataRepositoryBase<<%- name %>>, I<%- name %>Repository
{
}