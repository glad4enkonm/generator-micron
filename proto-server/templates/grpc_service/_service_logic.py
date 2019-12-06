import logging

# TO DO REMOVE ----------------------------------------------------
from p4lib import (
    get_permissions, set_permissions,
    create_user, get_user, save_user, delete_user, get_user_list,     
    save_group, get_group, save_group, get_group_list, delete_group
)
# ----------------------------------------------------

LOG_FORMAT = ('%(levelname) -10s %(asctime)s %(name) -30s %(funcName) '
              '-35s %(lineno) -5d: %(message)s')
LOGGER = logging.getLogger(__name__)

<% serviceList.forEach(function(service){ -%>
<%=`# ${service.name} ${service.operation} -------------------`%>
<%     service.protoServiceList.forEach(function(protoService){ -%>
<%         if (protoService.method.startsWith("Get")) { -%>
def <%= protoService.methodSnakeCase %>():
    # A place to write a great solution
    return result_list
<%         } else { -%>
def <%= protoService.methodSnakeCase %>(<%= protoService.nameCamelCase %>):
    # A place to write a great solution
<%         } -%>

<%     }); -%>

<% }); -%>