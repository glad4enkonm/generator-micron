using System.IO;
using System.Threading.Tasks;

using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

using Core.Business;
using Core.Business.Interface;
using Core.Repository;
using Core.Repository.Interface;
using Core.Grpc;

namespace Core
{
    static class Program
    {
        static async Task Main(string[] args)
        {

            await new HostBuilder()
              .ConfigureAppConfiguration((hostingContext, config) =>
              {
                  // Read a configuration file for our service
                  config.SetBasePath(Directory.GetCurrentDirectory());
                  config.AddJsonFile(
                      "config.json", optional: false, reloadOnChange: true);
              })
              .ConfigureLogging(logging => logging.AddConsole())
              .ConfigureServices((hostContext, services) =>
              {
                  // DependencyInjection
                  
                  // Repository
<% messageList.forEach(function(message){ -%>
                  services.AddSingleton(typeof(I<%= message.namePascal %>Repository), typeof(<%= message.namePascal %>Repository));
<% }); -%>

                  // Business logic
                  services.AddSingleton<I<%= packagePascalCase %>ServerLogic, <%= packagePascalCase %>ServerLogic>();
                  
                  // Grpc
                  // to do: add references on other micro service clients
                  services.AddHostedService<<%= serverName %>>();
              })
              .RunConsoleAsync();
        }
    }
}
