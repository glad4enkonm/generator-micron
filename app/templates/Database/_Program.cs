using DbUp;
using System;
using System.Linq;

namespace MigrateDB
{
    class Program
    {
        private const string ConnectionString = "Server=server;Database=database;User Id=user;Password=password;";

        static int Main(string[] args)
        {
            var connectionString = args.FirstOrDefault() ?? ConnectionString;
            EnsureDatabase.For.SqlDatabase(connectionString);

            var upgrader =
                DeployChanges.To
                    .SqlDatabase(connectionString)
                    .WithScriptsFromFileSystem("Scripts")
                    .LogToConsole()
                    .Build();

            var result = upgrader.PerformUpgrade();
            if (!result.Successful)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.Error.WriteLine(result.Error);
                Console.ResetColor();                

                return -1;
            }

            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("Success!");
            Console.ResetColor();
            return 0;
        }
    }
}