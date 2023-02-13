using Dapper.Contrib.Extensions;
namespace database.Models;

[Table("Currency")]
public class Currency
{
    [Key]
    public ulong CurrencyId { get; set; }
    public string Name { get; set; }
}