using database.Models;
namespace database.Repository;

public interface IOperatorCurrencyExchangeRateRepository : IDataRepository<OperatorCurrencyExchangeRate>
{
}

public class OperatorCurrencyExchangeRateRepository : DataRepositoryBase<OperatorCurrencyExchangeRate>, IOperatorCurrencyExchangeRateRepository
{
}