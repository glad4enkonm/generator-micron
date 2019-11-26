using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Microsoft.Extensions.Logging;

using Broadcast.<%= packagePascalCase %>;

using Core.Business.Interface;
using Core.Helper;
using Core.Repository.Interface;
using Core.Service.Interface;

using static Core.Helper.ExceptionHelper;
using static Core.Helper.UpdateHelper;

namespace Core.Business
{
    public class <%= serverLogicName %> : I<%= serverLogicName %>
    {
        private readonly ILogger<<%= serverLogicName %>> _logger;
        
        // Used repositories
<% messageList.forEach(function(message){ -%>
        private readonly I<%= message.namePascal %>Repository _<%= message.camelName %>Repository;
<% }); -%>

        // Used gRPC clients
        //private readonly IP4ApiClient _p4ApiClient;
        private readonly IMapper _mapper;

        public <%= serverLogicName %>(
<% messageList.forEach(function(message){ -%>
            I<%= message.namePascal %>Repository <%= message.camelName %>Repository,
<% }); -%>
            // Used gRPC clients
            // IP4ApiClient p4ApiClient

            ILogger<<%= serverLogicName %>> logger
        )
        {
<% messageList.forEach(function(message){ -%>
            _<%= message.camelName %>Repository = <%= message.camelName %>Repository;
<% }); -%>
            _groupRepository = groupRepository;

            _logger = logger;
            
            // Used gRPC clients
            //_p4ApiClient = p4ApiClient;

            var mapConfig = new MapperConfiguration(cfg => { cfg.AddProfile<<%= packagePascalCase %>Profile>(); });
            _mapper = mapConfig.CreateMapper();
        }

<% serviceList.forEach(function(service){ -%>
        #region <%= service.name + service.operation %>
<%   service.protoServiceList.forEach(function(protoService){ -%>
<%     if (protoService.method.startsWith("Get")) { -%>
            public <%= protoService.result %> <%= protoService.method %>(<%=protoService.param%> request)
            {
                <%= protoService.result %> function()
                {
                    IEnumerable<Model.<%= service.name%>> <%= protoService.nameLowerCase%>List = _<%= protoService.nameLowerCase%>Repository.GetAll();
                    var listTransport = _mapper.Map<IEnumerable<<%= service.name%>>>(<%= service.nameLowerCase%>List);
                    return listTransport.Construct<<%= protoService.result %>, <%= service.name%>>(resp => resp.<%= service.name%>List);
                }
                return ExecuteCatchLoagAndRethrowException(function, _logger, "<%= protoService.method %>");
<%     } else if (protoService.method.startsWith("Create")) { -%>
            public void <%= protoService.method %>(<%= protoService.param %> request)
            {
                var model = _mapper.Map<Model.<%= service.name %>>(request.<%= service.name %>);
                void action()
                {                    
                    _<%= protoService.nameLowerCase%>Repository.Insert(model);
                }
                ExecuteCatchLoagAndRethrowException(action, _logger, "<%= protoService.method %>");
<%     } else if (protoService.method.startsWith("Update")) { -%>
            public void <%= protoService.method %>(<%= protoService.param %> request)
            {
                var model = _mapper.Map<Model.<%= service.name %>>(request.<%= service.name %>);
                void action()
                {                 
                    var existingModel = _<%= protoService.nameLowerCase%>Repository
                        .Get(request.<%= service.name %>.<%= service.name %>Id);
                    _<%= protoService.nameLowerCase%>Repository.Update(model);
                }
                ExecuteCatchLoagAndRethrowException(action, _logger, "<%= protoService.method %>");
<%     } else if (protoService.method.startsWith("Delete")) { -%>
            public void <%= protoService.method %>(<%= protoService.param %> request)
            {
                void action()
                {
                    var modelToDelete = _<%= protoService.nameLowerCase%>Repository
                        .Get(request.<%= service.name %>.<%= service.name %>Id);
                    _<%= protoService.nameLowerCase%>Repository.Delete(modelToDelete);
                };
                ExecuteCatchLoagAndRethrowException(action, _logger, "<%= protoService.method %>");
<%     } -%>                
            }
<%   }); -%>
        #endregion

<% }); -%>       
    }
}