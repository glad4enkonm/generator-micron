import grpc
import time
import hashlib

broadcast_<%= package %> = __import__('broadcast-<%= package %>')
<%= package %>_pb2 = broadcast_<%= package %>.<%= package %>_pb2
<%= package %>_pb2_grpc = broadcast_<%= package %>.<%= package %>_pb2_grpc

from P4 import P4, P4Exception
from concurrent import futures
from configuration import config
import logging

LOG_FORMAT = ('%(levelname) -10s %(asctime)s %(name) -30s %(funcName) '
              '-35s %(lineno) -5d: %(message)s')
LOGGER = logging.getLogger(__name__)

import <%= package %>_service_logic as logic

def grpc_exception_wrapper(callback, method, context, param = None, return_result = False):
    try:
        LOGGER.info(method)
        callback_result = callback(param) if param != None else callback()
        if return_result:
            return callback_result
    except Exception as ex:
        error_str = str(ex)
        LOGGER.error(error_str)
        context.set_details(error_str)
        context.set_code(grpc.StatusCode.UNKNOWN)

class <%= packagePascalCase %>Server(<%= package %>_pb2_grpc.ServiceServicer):
    
    def __init__(self, *args, **kwargs):
        self.server_port = config['grpc']['port']

<% serviceList.forEach(function(service){ -%>
<%=`    # ${service.name} ${service.operation}`%>
<%     service.protoServiceList.forEach(function(protoService){ -%>
    def <%= protoService.method %>(self, request, context):
<%         if (protoService.method.startsWith("Get")) { -%>
<%             if (!service.getByInstance) { -%>
        list = grpc_exception_wrapper(logic.<%= protoService.methodSnakeCase %>, "<%= protoService.methodSnakeCase %>", context, return_result=True)
<%             } else { -%>
        list = grpc_exception_wrapper(logic.<%= protoService.methodSnakeCase %>, "<%= protoService.methodSnakeCase %>", context, param=request.<%= protoService.nameSnakeCase %>, return_result=True)
<%             } -%>
        return <%= package %>_pb2.<%= protoService.result %>(<%= protoService.nameSnakeCase %>_list = list)
<%         } else { -%>
        grpc_exception_wrapper(logic.<%= protoService.methodSnakeCase %>, "<%= protoService.methodSnakeCase %>", context, param=request.<%= protoService.nameSnakeCase %>)
        return <%= package %>_pb2.Empty()
<%         } -%>

<%     }); -%>

<% }); -%>

    def stop_server(self):
        self.<%= package %>_server.stop(0)
        LOGGER.info('Server Stopped ...')

    def start_server(self):        
        self.<%= package %>_server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))        
        p4api_pb2_grpc.add_ServiceServicer_to_server(P4APIServer(), self.<%= package %>_server)        
        self.<%= package %>_server.add_insecure_port('[::]:{}'.format(self.server_port))

        # start the server
        self.<%= package %>_server.start()
        LOGGER.info('Server running ...  port' + str(config['grpc']['port']))  
