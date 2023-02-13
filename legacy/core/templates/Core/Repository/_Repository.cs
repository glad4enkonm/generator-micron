using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Core.Model;
using Core.Repository.Interface;

namespace Core.Repository
{
    public class <%= namePascal %>Repository : DataRepositoryBase<<%= namePascal %>>, I<%= namePascal %>Repository
    {
        public <%= namePascal %>Repository(
            IConfiguration config, 
            ILogger<DataRepositoryBase<<%= namePascal %>>> logger) 
            : base(config, logger) 
            {
            }        
    }
}
