using Grpc.Core;
using Microsoft.Extensions.Logging;
using System;

namespace Core.Helper
{
    public static class ExceptionHelper
    {
        public static void ExecuteCatchLoagAndRethrowException(Action action, ILogger logger, string message)
        {
            try
            {
                action();
                logger.LogInformation($"{message} : done");
            }
            catch (RpcException ex)
            {
                logger.LogError($"{message} : {ex}");
                throw ex;
            }
            catch (Exception ex)
            {
                logger.LogError($"{message} : {ex}");
                throw new RpcException(new Status(StatusCode.Unknown, ex.Message));
            }
        }

        public static T ExecuteCatchLoagAndRethrowException<T>(Func<T> function, ILogger logger, string message)
        {
            try
            {
                T result = function();
                logger.LogInformation($"{message} : done");
                return result;
            }
            catch (RpcException ex)
            {
                logger.LogError($"{message} : {ex}");
                throw ex;
            }
            catch (Exception ex)
            {
                logger.LogError($"{message} : {ex}");
                throw new RpcException(new Status(StatusCode.Unknown, ex.Message));
            }
        }
    }
}
