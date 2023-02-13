using Dapper.Contrib.Extensions;
namespace database.Models;

[Table("OperatorCurrencyExchangeRate")]
public class OperatorCurrencyExchangeRate
{
    [Key]
    public ulong OperatorCurrencyExchangeRateId { get; set; }
    public decimal ExchangeRate { get; set; }
    public ulong UserId { get; set; }
    public ulong CurrencyFromId { get; set; }
    public ulong CurrencyToId { get; set; }
}