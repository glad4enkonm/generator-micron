using System.Collections.Generic;

namespace Core.Repository.Interface
{
    public interface IDataRepository<T> where T : class
    {

        T Get(int id);
        IEnumerable<T> GetAll();
        int Insert(T obj);
        int Insert(IEnumerable<T> list);
        bool Update(T obj);
        bool Update(IEnumerable<T> list);
        bool Delete(T obj);
        bool Delete(IEnumerable<T> list);
        bool DeleteAll();

    }
}
