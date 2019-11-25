using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using Core.Model;
using System.Linq;
using Core.Helper;
using Dapper.Contrib.Extensions;
using Core.Repository.Interface;
using Dapper;

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
