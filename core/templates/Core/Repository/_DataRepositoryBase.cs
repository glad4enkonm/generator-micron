using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using Core.Helper;
using Core.Repository.Interface;
using Dapper.Contrib.Extensions;

namespace Core.Repository
{
    public class DataRepositoryBase<T>: IDataRepository<T> where T : class
    {
        protected readonly ILogger<DataRepositoryBase<T>> _logger;
        protected readonly string _connectionString;
        public DataRepositoryBase(IConfiguration config, ILogger<DataRepositoryBase<T>> logger)
        {
            _logger = logger;
            _connectionString = config.GetConnectionString();
        }

        public virtual T Get(int id) => _connectionString.QueryUsingConnection(con => con.Get<T>(id));

        public virtual IEnumerable<T> GetAll() =>
            _connectionString.QueryUsingConnection(con => con.GetAll<T>());

        public virtual int Insert(T obj) => (int)_connectionString.QueryUsingConnection(con => con.Insert(obj));

        public virtual int Insert(IEnumerable<T> list) => (int)_connectionString.QueryUsingConnection(con => con.Insert(list));

        public virtual bool Update(T obj) => _connectionString.QueryUsingConnection(con => con.Update(obj));

        public virtual bool Update(IEnumerable<T> list) => _connectionString.QueryUsingConnection(con => con.Update(list));

        public virtual bool Delete(T obj) => _connectionString.QueryUsingConnection(con => con.Delete(obj));

        public virtual bool Delete(IEnumerable<T> list) => _connectionString.QueryUsingConnection(con => con.Delete(list));

        public virtual bool DeleteAll() => _connectionString.QueryUsingConnection(con => con.DeleteAll<T>());
    }

}
