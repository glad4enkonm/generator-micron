using System;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace Core.Helper
{
    static class ConfigHelperExtensions
    {

        private const string DefaultConnection = "DefaultConnection";

        private const string Password = "Password";
        private const string Server = "Server";
        private const string Database = "Database";
        private const string User = "User";

        private const string HostName = "HostName";

        private const string Port = "Port";

        private const string P4VHostName = "P4VClientHostName";

        private const string P4VPort = "P4VClientPort";


        public static string GetConnectionString(this IConfiguration config)
        {

            IConfigurationSection dbConfig = config.GetSection("Database");
            string serverVal = dbConfig.GetValue<string>(Server);
            string databaseVal = dbConfig.GetValue<string>(Database);
            string userVal = dbConfig.GetValue<string>(User);
            string passwordVal = Encoding.UTF8.GetString(
                    Convert.FromBase64String(dbConfig.GetValue<string>(Password)));

            string connectionStr = $"Server={serverVal};Database={databaseVal};User Id={userVal};Password={passwordVal};";           

            return connectionStr;           
        }

        public static dynamic GetGrpcConfigObject(this IConfiguration config, string section = null)
        {
            IConfigurationSection thisConfig = config.GetSection("GRPC");

            if (section != null)
                thisConfig = thisConfig.GetSection(section);

            return new
            {
                HostName = thisConfig.GetValue<string>(HostName),
                Port = thisConfig.GetValue<int>(Port)
            };
        }


    }
}
