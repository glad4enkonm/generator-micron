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

from p4lib import (
    get_permissions, set_permissions,
    create_user, get_user, save_user, delete_user, get_user_list,     
    save_group, get_group, save_group, get_group_list, delete_group
)

LOG_FORMAT = ('%(levelname) -10s %(asctime)s %(name) -30s %(funcName) '
              '-35s %(lineno) -5d: %(message)s')
LOGGER = logging.getLogger(__name__)

def grpc_exception_wrapper(callback, method, context, return_result = False):
    try:
        LOGGER.info(method)
        callback_result = callback()
        if return_result:
            return callback_result
    except Exception as ex:
        error_str = str(ex)
        LOGGER.error(error_str)
        context.set_details(error_str)
        context.set_code(grpc.StatusCode.UNKNOWN)

class UserServicer(<%= package %>_pb2_grpc.ServiceServicer):
    
    def __init__(self, *args, **kwargs):
        self.server_port = config['grpc']['port']

    def GetPermissions(self, request, context):
        def action():
            permissionStringList = get_permissions()
            i = 1
            list = []        
            for item in permissionStringList:   
                permissionArray = item.split()
                newItem = {}
                newItem['access_level'] = permissionArray[0]
                newItem['user_group'] = permissionArray[1]
                newItem['name'] = permissionArray[2]
                newItem['host'] = permissionArray[3]
                newItem['folder_file'] = permissionArray[4]
                if len(permissionArray) > 5:
                    newItem['comment'] = permissionArray[5].replace("##","")                     
                newItem['is_edited'] = False
                newItem['is_new'] = True
                newItem['is_deleted'] = False
                newItem['priority_id'] = i

                list.append(newItem)
                i = i + 1
            return list    
        list = grpc_exception_wrapper(action, "GetPermissions", context, True)
        return <%= package %>_pb2.PermissionResponse(permission_list = list)

    def PermissionBatchSave(self, request, context):
        def action():
            permissions = get_permissions()
            for perm in permissions[:]:
                permission_splits = perm.split()
                if permission_splits[0] != 'super':
                    permissions.remove(perm)
            for perm_item in request.permission:
                permission_string = (perm_item.accesslevel + " " + perm_item.usergroup + " " + perm_item.name + " " 
                    + perm_item.host+ " " + perm_item.folderfile + " ##" + perm_item.comment)
                permissions.append(permission_string)
            set_permissions(permissions)
        grpc_exception_wrapper(action, "PermissionBatchSave", context)
        return <%= package %>_pb2.Empty()

    def UpdateUser(self, request, context):        
        def action():
            user = {
                'Email': request.email,
                'FullName': request.full_name,
                'User': request.login,
            }        
            save_user(user)
        grpc_exception_wrapper(action, "UpdateUser", context)
        return <%= package %>_pb2.Empty()
 
    def GetUsers(self, request, context):                
        def action():
            user_list = get_user_list()        
            response = []
            for user in user_list:
                newItem = {}
                newItem['login'] = user["User"]
                newItem['full_name'] = user["FullName"]
                newItem['email'] = user["Email"]
                response.append(newItem)
            return response
        response = grpc_exception_wrapper(action, "GetUsers", context, True)
        return <%= package %>_pb2.UserResponse(user = response)
    
    def CreateUser(self, request, context):        
        def action():
            new_user = {
                'User': request.login,
                'Email': request.email,
                'FullName': request.full_name,
                # 'Password': request.password,
            }
            create_user(new_user)
        grpc_exception_wrapper(action, "CreateUser", context)
        return <%= package %>_pb2.Empty()
    
    def DeleteUser(self, request, context):
        grpc_exception_wrapper(lambda : delete_user(request.login), "DeleteUser", context)
        return <%= package %>_pb2.Empty()

    # Group Codes Starts Here

    def CreateGroup(self, request, context):                    
        def action():
            userList = []
            for user in request.user_list:
                userList.append(user.login)
            new_group = {
                'Group' : request.name,
                'Users': userList,
                'Owners': [request.owner]
            }
            save_group(new_group)
        grpc_exception_wrapper(action, "CreateGroup", context)
        return <%= package %>_pb2.Empty()

    def UpdateGroup(self, request, context):
        def action():
            userList = []
            for user in request.user_list:
                userList.append(user.login)
            new_group = {
                'Group' : request.name,
                'Users': userList,
                'Owners': [request.owner]
            }
            save_group(new_group)
        grpc_exception_wrapper(action, "UpdateGroup", context)
        return <%= package %>_pb2.Empty()
        
    def DeleteGroup(self, request, context):
        grpc_exception_wrapper(lambda : delete_group(request.name), "DeleteGroup", context)
        return <%= package %>_pb2.Empty()

    def GetGroups(self, request, context):                    
        def action():
            group_list = get_group_list()                        
            groupList = sorted(set(list(map(lambda group: group["group"], group_list))))
            # to do: refactor everything down from here
            # To sort the list with isUser and isOwner in Group
            groupResponse = []
            for groupName in groupList:
                groupUsers = [x for x in group_list if x['group'] == groupName]
                currentGroup = {"name": groupName, "user_list": [], "owner": ""}
                for user in groupUsers:
                    if user["isUser"] == "1":
                        currentGroup["user_list"].append({"login": user["user"]})
                    if user["isOwner"] == "1":
                        currentGroup["owner"] = user["user"]
                groupResponse.append(currentGroup)
            return groupResponse
        groupResponse = grpc_exception_wrapper(action, "GetGroups", context, True)
        return <%= package %>_pb2.GroupResponse(group_list = groupResponse)        


    def stop_server(self):
        self.user_server.stop(0)
        LOGGER.info('Server Stopped ...')

    def start_server(self):        
        self.user_server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))        
        <%= package %>_pb2_grpc.add_ServiceServicer_to_server(UserServicer(), self.user_server)        
        self.user_server.add_insecure_port('[::]:{}'.format(self.server_port))

        # start the server
        self.user_server.start()
        LOGGER.info('Server running ...  port' + str(config['grpc']['port']))                    

