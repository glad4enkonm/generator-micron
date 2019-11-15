using Core.Repository;
using Core.Repository.Interface;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Core.Message.Interface;
using Core.Message;
using Core.Message.Handler.Interface;
using Core.Message.Handler;
using Microsoft.Extensions.Logging;
using Core.Communication.Interface;
using Core.Repository.DataRepositoryDapper;

namespace Core
{
    internal class Program
    {
        static async Task Main(string[] args)
        {
            await new HostBuilder()
                .ConfigureAppConfiguration((hostingContext, config) =>
                {
                    // Read a configuration file for our service
                    config.SetBasePath(Directory.GetCurrentDirectory());
                    config.AddJsonFile(
                        "config.json", optional: true, reloadOnChange: true);
                })
                .ConfigureLogging(logging => logging.AddConsole())
                .ConfigureServices((hostContext, services) =>
                {
                    // DependencyInjection
                    services.AddSingleton<IDataRepository, DataRepositoryDapper>();
                    services.AddSingleton<ICommandRepository, CommandRepository>();
                    services.AddSingleton<IMessageHandler, MessageHandler>();
                    services.AddSingleton<IInitializeMessageHandler, InitializeMessageHandler>();
                    services.AddSingleton<IUpdateMessageHandler, UpdateMessageHandler>();
                    services.AddSingleton<IRabbitMQ, Communication.RabbitMQ>();

                    // Register services
                    services.AddHostedService<Service.RabbitMQ>();
                    services.AddHostedService<Service.GRPC>();
                })                
                .RunConsoleAsync();
        }
    }
}
