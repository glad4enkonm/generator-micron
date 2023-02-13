import logging


LOG_FORMAT = ('%(levelname) -10s %(asctime)s %(name) -30s %(funcName) '
              '-35s %(lineno) -5d: %(message)s')
LOGGER = logging.getLogger(__name__)

<% serviceList.forEach(function(service){ -%>
<%=`# ${service.name} ${service.operation} -------------------`%>
<%     service.protoServiceList.forEach(function(protoService){ -%>
<%         if (protoService.method.startsWith("Get") && !service.getByInstance) { -%>
def <%= protoService.methodSnakeCase %>():
    # A place to write a great solution
    return result_list
<%         } else { -%>
def <%= protoService.methodSnakeCase %>(<%= protoService.nameSnakeCase %>):
    # A place to write a great solution
<%         } -%>

<%     }); -%>

<% }); -%>