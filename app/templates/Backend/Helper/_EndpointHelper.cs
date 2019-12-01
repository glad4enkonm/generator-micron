using System;
using Grpc.Core;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Backend.Helper
{
    public static class EndpointHelper
    {
        public static ActionResult ExecuteLoagAndReturnStatus(Action action, 
            ILogger logger, string message, ControllerBase controller)
        {
            try
            {
                action();
                logger.LogInformation($"{message} : done");
                return controller.Ok();
            }            
            catch (RpcException ex)
            {
                logger.LogError($"gRPC {message} : {ex}");
                return controller.BadRequest(ex.Status.Detail);
            }
            catch (Exception ex)
            {
                logger.LogError($"{message} : {ex}");
                return controller.BadRequest(ex.Message);
            }
        }

        public static ActionResult<T> ExecuteLoagAndReturnStatus<T>(
            Func<T> function, ILogger logger, string message, ControllerBase controller)
        {
            try
            {
                T result = function();
                logger.LogInformation($"{message} : done");
                return controller.Ok(result);
            }
            catch (RpcException ex)
            {
                logger.LogError($"gRPC {message} : {ex}");
                return controller.BadRequest(ex.Status.Detail);
            }
            catch (Exception ex)
            {
                logger.LogError($"{message} : {ex}");
                return controller.BadRequest(ex.Message);
            }
        }

        public static async Task<ActionResult> ExecuteLoagAndReturnStatusAsync(Func<Task> action,
            ILogger logger, string message, ControllerBase controller)
        {
            try
            {
                await action();
                logger.LogInformation($"{message} : done");
                return controller.Ok();
            }
            catch (RpcException ex)
            {
                logger.LogError($"gRPC {message} : {ex}");
                return controller.BadRequest(ex.Status.Detail);
            }
            catch (Exception ex)
            {
                logger.LogError($"{message} : {ex}");
                return controller.BadRequest(ex.Message);
            }
        }

        public static async Task<ActionResult<T>> ExecuteLoagAndReturnStatusAsync<T>(
            Func<Task<T>> function, ILogger logger, string message, ControllerBase controller)
        {
            try
            {
                T result = await function();
                logger.LogInformation($"{message} : done");
                return controller.Ok(result);
            }
            catch (RpcException ex)
            {
                logger.LogError($"gRPC {message} : {ex}");
                return controller.BadRequest(ex.Status.Detail);
            }
            catch (Exception ex)
            {
                logger.LogError($"{message} : {ex}");
                return controller.BadRequest(ex.Message);
            }
        }
    }
}
