using System.Threading;
using System.Threading.Tasks;
using Broadcast.User;
using Grpc.Core;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using UserProj.Business.Interface;
using UserProj.Helper;
using static Broadcast.User.Service;

namespace UserProj.Service
{
    public class UserServer : ServiceBase, IHostedService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<UserServer> _logger;
        private readonly IUserService _userService;

        private Server _serverInstance;

        public UserServer(IConfiguration configuration, ILogger<UserServer> logger, IUserService userService)
        {
            _configuration = configuration;
            _logger = logger;
            _userService = userService;
        }        

        public Task StartAsync(CancellationToken cancellationToken)
        {
            var config = _configuration.GetGrpcConfigObject("User");

            _serverInstance = new Server
            {
                Ports = {new ServerPort(config.HostName, config.Port, ServerCredentials.Insecure)},
                Services = {BindService(this)}
            };
            _serverInstance.Start();
            _logger.LogInformation($"gRPC service started on {config.HostName}:{config.Port}");


            return Task.CompletedTask;
        }
        
        public Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("stopping gRPC UserServer ...");
            return _serverInstance.ShutdownAsync();
        }

        #region User code

        public override async Task<Empty> SyncUser(Empty request, ServerCallContext context)
        {
            _userService.SyncUser();
            return new Empty();
        }

        public override async Task<Empty> CreateUser(User user, ServerCallContext context)
        {
            _userService.CreateUser(user);
            return new Empty();
        }

        public override async Task<UserResponse> GetUsers(Empty request, ServerCallContext context)
        {            
            _userService.SyncUser();

            UserResponse userResponse = _userService.GetUsers();
            _logger.LogInformation($"GetUsers : {userResponse.UserList.Count} returned");

            return userResponse;         
        }

        public override async Task<Empty> UpdateUser(User user, ServerCallContext context)
        {
            _userService.UpdateUser(user);
            return new Empty();
        }

        public override async Task<Empty> DeleteUser(UserRequest userRequest, ServerCallContext context)
        {
            _userService.DeleteUser(userRequest.DaimlerId);
            return new Empty();
        }

        #endregion

        #region Group code        

        public override async Task<Empty> CreateGroup(Group Group, ServerCallContext context)
        {
            _userService.CreateGroup(Group);
            return new Empty();
        }

        public override async Task<Empty> UpdateGroup(Group Group, ServerCallContext context)
        {
            _userService.UpdateGroup(Group);
            return new Empty();
        }

        public override async Task<Empty> DeleteGroup(GroupRequest groupRequest, ServerCallContext context)
        {
            _userService.DeleteGroup(groupRequest.GroupName);
            return new Empty();
        }

        public override async Task<GroupResponse> GetGroups(Empty request, ServerCallContext context)
        {
            _userService.SyncGroup();

            GroupResponse groupResponse = _userService.GetGroups();
            _logger.LogInformation($"GetGroups : {groupResponse.GroupList.Count} returned");
            return groupResponse;
        }

        public override async Task<Empty> SyncGroup(Empty request, ServerCallContext context)
        {
            _userService.SyncGroup();
            return new Empty();
        }

        #endregion
    }
}