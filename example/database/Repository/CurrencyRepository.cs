using database.Models;
namespace database.Repository;

public interface ICurrencyRepository : IDataRepository<Currency>
{
}

public class CurrencyRepository : DataRepositoryBase<Currency>, ICurrencyRepository
{
}