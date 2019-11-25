using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using <%= packagePascalCase %>.Model;
using System.Linq;
using <%= packagePascalCase %>.Helper;
using Dapper.Contrib.Extensions;
using <%= packagePascalCase %>.Repository.Interface;
using Dapper;

namespace <%= packagePascalCase %>.Repository
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
